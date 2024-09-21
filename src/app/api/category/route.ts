import { NextRequest, NextResponse } from 'next/server';
import Category from '@/models/categoryModel';
import connectDB from '@/lib/db';
import { validateApiKey } from '@/lib/apiKeyValid';

export async function GET(request: NextRequest) {
  // Validate API Key
  const apiKeyResponse = validateApiKey(request);
  if (apiKeyResponse) {
    return apiKeyResponse;
  }

  await connectDB(); // Connect to MongoDB

  try {
    const categories = await Category.find();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Validate API Key
  const apiKeyResponse = validateApiKey(request);
  if (apiKeyResponse) {
    return apiKeyResponse;
  }

  await connectDB(); // Connect to MongoDB

  try {
    const { name, subcategories = [] } = await request.json(); // Default subcategories to an empty array if not provided

    // Check if name is provided
    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    // Ensure subcategories is an array of strings, if provided
    if (subcategories.length > 0) {
      if (!Array.isArray(subcategories)) {
        return NextResponse.json({ error: 'Subcategories should be an array' }, { status: 400 });
      }

      for (const subcategory of subcategories) {
        if (typeof subcategory !== 'string') {
          return NextResponse.json({ error: 'Each subcategory should be a string reference' }, { status: 400 });
        }
      }
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
    }

    // Create and save new category
    const category = new Category({ name, subcategories });
    await category.save();
    return NextResponse.json(category, { status: 201 });
  } catch (error : any) {
    console.error("Error creating category:", error);

    // Return specific error messages based on the type of error
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON format in request body' }, { status: 400 });
    }
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    // Handle other potential errors
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
