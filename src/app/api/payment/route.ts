import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/apiKeyValid';
import Razorpay from 'razorpay';
import connectDB from '@/lib/db'; // Import your database connection
import Order from '@/models/orderModel'; // Import the order model

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Define the expected shape of the incoming request data
interface OrderData {
  name: string;
  email: string;
  phone: string;
  totalPrice: number;
  items: any[]; // Adjust the type according to your item structure
  address : string;
}

export async function POST(request: NextRequest) {
  // Validate API Key
  const apiKeyResponse = validateApiKey(request);
  if (apiKeyResponse) {
    return apiKeyResponse;
  }

  try {
    await connectDB(); // Ensure the database connection is established

    const data: OrderData = await request.json();
    console.log("Data got from the client: ", data);

    // Create order in Razorpay
    const options = {
      amount: data.totalPrice * 100, // Convert to smallest currency unit (e.g., INR to paise)
      currency: 'INR',
      receipt: `receipt#${Math.floor(Math.random() * 1000000)}`, // Unique receipt number
      payment_capture: 1,
      notes: {
        items: JSON.stringify(data.items),
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);
    
    // Ensure the order creation was successful
    if (!razorpayOrder || !razorpayOrder.id) {
      throw new Error('Razorpay order creation failed');
    }

    console.log("This is the order to be stored in MongoDB: ", razorpayOrder);
    
    // Create a new order instance for MongoDB
    const newOrder = new Order({
      customerName: data.name,
      email: data.email,
      phone: data.phone,
      items: data.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image,
      })),
      address : data.address,
      totalAmount: razorpayOrder.amount as number / 100, // Convert back to currency unit
      amountDue: razorpayOrder.amount_due / 100, // Use amount_due from Razorpay
      amountPaid: razorpayOrder.amount_paid / 100, // Use amount_paid from Razorpay
      currency: 'INR',
      orderId: razorpayOrder.id, // Use Razorpay order ID
      paymentStatus: 'pending',
      status: 'created',
    });

    // Save the order in MongoDB
    await newOrder.save();

    return NextResponse.json({ status: 'success', razorpayOrderId: razorpayOrder.id });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to create order' }, { status: 500 });
  }
}
