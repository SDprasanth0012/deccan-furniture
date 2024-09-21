import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import { validateApiKey } from '@/lib/apiKeyValid';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const apiKeyResponse = validateApiKey(request);
  if (apiKeyResponse) {
    return apiKeyResponse;
  }

  const { id } = params; // Order ID from the URL
  const { status } = await request.json(); // Extract the new status from the request body

  await connectDB(); // Connect to the database
     console.log("the new status is", status)
  try {
    const result = await mongoose.model('Order').findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true } // Return the updated document
    );

    if (!result) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Status updated successfully', order: result });
  } catch (error : any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const apiKeyResponse = validateApiKey(request);
  if (apiKeyResponse) {
    return apiKeyResponse;
  }

  const { id } = params;

  await connectDB(); // Connect to the database

  try {
    const result = await mongoose.model('Order').findByIdAndDelete(id);
    
    if (!result) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 204 });
  } catch (error:any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
