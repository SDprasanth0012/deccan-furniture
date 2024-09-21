import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db'; // Ensure this path is correct
import Order from '@/models/orderModel'; // Adjust the path as needed
import { validateApiKey } from '@/lib/apiKeyValid';

export async function GET(request : NextRequest) {
    const apiKeyResponse = validateApiKey(request);
    if (apiKeyResponse) {
      return apiKeyResponse;
    }
    
    try {
     await connectDB(); // Connect to the database
    const orders = await Order.find({}); // Fetch all orders
    return NextResponse.json(orders); // Send the list of orders
  } catch (error:any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
