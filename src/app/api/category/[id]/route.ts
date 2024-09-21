import { NextRequest, NextResponse } from 'next/server';
import Category from '@/models/categoryModel';
import connectDB from '@/lib/db';
import { validateApiKey } from '@/lib/apiKeyValid';

// GET /api/category/[id]
export async function GET(request: NextRequest) {
  const apiKeyResponse = await validateApiKey(request);
  if (apiKeyResponse) {
    return apiKeyResponse;
  }

  await connectDB(); // Connect to MongoDB

  const id = request.nextUrl.pathname.split('/').pop();

  try {
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

// PUT /api/category/[id]
export async function PUT(request: NextRequest) {
  const apiKeyResponse = await validateApiKey(request);
  if (apiKeyResponse) {
    return apiKeyResponse;
  }

  await connectDB(); // Connect to MongoDB

  const id = request.nextUrl.pathname.split('/').pop();
  const { name, subcategories } = await request.json();

  try {
    const category = await Category.findByIdAndUpdate(id, { name, subcategories }, { new: true });
    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE /api/category/[id]
export async function DELETE(request: NextRequest) {
  const apiKeyResponse = await validateApiKey(request);
  if (apiKeyResponse) {
    return apiKeyResponse;
  }

  await connectDB(); // Connect to MongoDB

  const id = request.nextUrl.pathname.split('/').pop();

  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
