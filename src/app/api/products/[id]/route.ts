import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/productModel'; // Import the Product model
import mongoose from 'mongoose';
import { validateApiKey } from '@/lib/apiKeyValid';

// GET /api/product/[id]
// export async function GET(request: NextRequest, context: { params?: { id?: string } }) {
//   const apiKeyResponse = await validateApiKey(request);
//   if (apiKeyResponse) {
//     return apiKeyResponse;
//   }

//   const id = (await context.params)?.id;

//   // Validate ID
//   if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//     return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
//   }

//   await connectDB();
//   console.log("Control came here")
//   try {
//     const product = await Product.findById(id).exec();
//     if (!product) {
//       return NextResponse.json({ message: 'Product not found' }, { status: 404 });
//     }
//     return NextResponse.json(product);
//   } catch (error) {
//     return NextResponse.json({ message: 'Error fetching product', error: (error as Error).message }, { status: 500 });
//   }
// }
export async function GET(request: NextRequest, context :  any ) {
  const apiKeyResponse = await validateApiKey(request);
  if (apiKeyResponse) {
    return apiKeyResponse;
  }

  const { id } = context.params;

  // Validate ID
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
  }

  await connectDB();
  console.log("Control came here");
  
  try {
    const product = await Product.findById(id).exec();
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching product', error: (error as Error).message }, { status: 500 });
  }
}

// PUT /api/product/[id]
export async function PUT(request: NextRequest, context: any) {
  const apiKeyResponse = await validateApiKey(request);
  if (apiKeyResponse) {
    return apiKeyResponse;
  }

  const id = (await context.params)?.id;

  // Validate ID
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
  }

  const { name, price, discount, description, category, subcategory }: {
    name?: string;
    price?: number;
    discount?: number;
    description?: string;
    category?: string; // Category ID as a string
    subcategory?: string;
  } = await request.json();

  // Validate required fields if they are provided
  if (category && !mongoose.Types.ObjectId.isValid(category)) {
    return NextResponse.json({ message: 'Invalid category ID' }, { status: 400 });
  }

  await connectDB();

  try {
    const updateData: Partial<{
      name: string;
      image: string[];
      category: mongoose.Types.ObjectId;
      subcategory: string;
      description: string;
      price: number;
      discount: number;
      features: string[];
      reviews: any[]; // Can be of any type as per schema
      rating: number;
      numReviews: number;
    }> = {};

    // Only include fields that are provided in the request
    if (name) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (discount !== undefined) updateData.discount = discount;
    if (description) updateData.description = description;
    if (category) updateData.category = new mongoose.Types.ObjectId(category); // Convert to ObjectId
    if (subcategory) updateData.subcategory = subcategory;

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).exec();

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating product', error: (error as Error).message }, { status: 500 });
  }
}

// DELETE /api/product/[id]
export async function DELETE(request: NextRequest, context: any ) {
  const apiKeyResponse = await validateApiKey(request);
  if (apiKeyResponse) {
    return apiKeyResponse;
  }

  const id = (await context.params)?.id;

  // Validate ID
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
  }

  await connectDB();

  try {
    const product = await Product.findByIdAndDelete(id).exec();

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting product', error: (error as Error).message }, { status: 500 });
  }
}
