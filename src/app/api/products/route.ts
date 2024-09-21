import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/productModel';
import Category from '@/models/categoryModel'; // Import Category model to validate category existence
import { validateApiKey } from '@/lib/apiKeyValid';

export async function GET(request: NextRequest) {
  // Validate API Key
  const apiKeyResponse = validateApiKey(request);
  if (apiKeyResponse) {
    return apiKeyResponse;
  }

  await connectDB();

  const url = new URL(request.url);
  const categoryId = url.searchParams.get('category');
  const subcategory = url.searchParams.get('subcategory');
  const searchTerm = url.searchParams.get('search') || '';
  const sortBy = url.searchParams.get('sort') || 'name'; // Default sort field
  const sortOrder = url.searchParams.get('order') === 'desc' ? -1 : 1; // Default sort order

  console.log('Searching for:', searchTerm);

  try {
    let products;

    // Build the query object
    const query: any = {};

    if (categoryId) {
      // If a category is provided, add it to the query
      query.category = categoryId;
    }

    if (subcategory) {
      // If a subcategory is provided, add it to the query
      query.subcategory = subcategory;
    }

    if (searchTerm) {
      // If a search term is provided, add search conditions
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ];
    }
     console.log(query)
    // Fetch products based on the constructed query and sort options
    products = await Product.find(query).populate('category').sort({ [sortBy]: sortOrder });
    console.log(products);

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching products', error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Validate API Key
  const apiKeyResponse = validateApiKey(request);
  if (apiKeyResponse) {
    return apiKeyResponse;
  }

  const data = await request.json();

  await connectDB();

  try {
    const { category } = data;

    // Validate that the provided category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return NextResponse.json({ message: 'Category not found' }, { status: 400 });
    }

    const newProduct = new Product(data);
    await newProduct.save();
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating product', error }, { status: 500 });
  }
}
