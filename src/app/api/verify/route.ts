import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { validateApiKey } from '@/lib/apiKeyValid';
import connectDB from '@/lib/db';
import Order from '@/models/orderModel'; // Import your Order model

export async function POST(request: NextRequest) {
  // Validate the API key
  const apiKeyResponse = validateApiKey(request);
  if (apiKeyResponse) {
    return apiKeyResponse; // Return the response if validation fails
  }

  // Connect to the database
  await connectDB();

  try {
    // Extract the necessary data from the request
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
    
    // Your Razorpay secret key
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // Generate the signature for verification
    const generated_signature = crypto
      .createHmac('sha256', key_secret as string)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Check if the generated signature matches the received signature
    if (generated_signature === razorpay_signature) {
      // Payment is verified successfully
      // Update the order in the database
      const updatedOrder = await Order.updateOne(
        { orderId: razorpay_order_id }, // Find the order by Razorpay order ID
        {
          paymentStatus: 'completed',
          status: 'pending', // Adjust based on your workflow
           // Capture the amount if necessary
          paymentId: razorpay_payment_id,
        }
      );

      if (updatedOrder.modifiedCount > 0) { // Use modifiedCount instead of nModified
        const orderDetails = await Order.findOne({ orderId: razorpay_order_id });

        if (orderDetails) {
          // Send the updated order details to the client
          return NextResponse.json({
            status: 'success',
            message: 'Payment verified and order updated successfully!',
            orderDetails, // Include the order details in the response
          }, { status: 200 });
        } else {
          return NextResponse.json({ status: 'error', message: 'Order not found after update.' }, { status: 404 });
        }
      } else {
        return NextResponse.json({ status: 'error', message: 'Order not found or not updated.' }, { status: 404 });
      }
    } else {
      // Verification failed
      await Order.updateOne(
        { orderId: razorpay_order_id },
        {
          paymentStatus: 'failed',
          status: 'canceled', // Adjust as needed
        }
      );

      return NextResponse.json({ status: 'failure', message: 'Payment verification failed!' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}
