import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // Ensure the correct path to your connectDB function
import Product from '@/models/productModel'; // Ensure the correct path to your Product model
import {User} from '@/models/userModels'; // Ensure you have a User model to fetch user details
import { validateApiKey } from '@/lib/apiKeyValid'; // Adjust the path as needed

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  // Validate API Key
  const apiKeyResponse = validateApiKey(req);
  if (apiKeyResponse) {
    return apiKeyResponse;
  }

  // Connect to MongoDB
  await connectDB();

  try {
    const { id } = params;
    const { rating, comment, userId } = await req.json();

    console.log(rating, comment, userId);

    if (!rating || !comment || !userId) {
      console.log('Rating, comment, and userId are required');
      return NextResponse.json({ message: 'Rating, comment, and userId are required' }, { status: 400 });
    }

    // Find the product by ID
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Fetch the user by ID to get their first name
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Add the review to the product's reviews array
    product.reviews.push({
      name: user.firstName || 'Anonymous', // Use user's first name or 'Anonymous'
      rating,
      comment,
      user: userId, // User ID should come from authenticated user
    });

    console.log('Review added successfully');

    // Update product rating and number of reviews
    const totalRating = product.reviews.reduce((acc: number, review: any) => acc + review.rating, 0);
    product.rating = totalRating / product.reviews.length;
    product.numReviews = product.reviews.length;

    console.log('Last review:', product.reviews[product.reviews.length - 1]);

    // Save the updated product
    await product.save();

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
  }
}
