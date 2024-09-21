"use server";

import Product from "@/models/productModel";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

// Define ReviewInput type (if not defined elsewhere)
interface ReviewInput {
  name: string;
  rating: number;
  comment: string;
  user: string; // User ID as a string
}

// Define CreateProductInput type
type CreateProductInput = {
  name: string;
  images: string[];
  category: string; // Category ID as a string
  subcategory: string; // Single subcategory string
  description: string;
  price: number;
  discount?: number; // Optional, defaults to 0
  features?: string[]; // Optional, defaults to an empty array
  reviews?: ReviewInput[]; // Optional, defaults to an empty array
};

export async function createProduct(data: CreateProductInput): Promise<void> {
  await connectDB(); // Connect to MongoDB

  const {
    name,
    images,
    category,
    subcategory,
    description,
    price,
    discount,
    features,
    reviews,
  } = data;

  console.log('Creating product started');

  // Validate and convert category to ObjectId
  let categoryId: mongoose.Types.ObjectId | null = null;
  if (mongoose.Types.ObjectId.isValid(category)) {
    categoryId = new mongoose.Types.ObjectId(category);
  } else {
    throw new Error('Invalid category ID');
  }

  const newProduct = new Product({
    name,
    image: images,
    category: categoryId, // Correctly set category as ObjectId
    subcategory,
    description,
    price,
    discount: discount || 0, // Default to 0 if discount is not provided
    features: features || [], // Default to empty array if features are not provided
    reviews: reviews || [], // Default to empty array if no reviews provided
  });

  try {
    const savedProduct = await newProduct.save(); // Save product to MongoDB
    console.log('Product successfully saved:', savedProduct);
  } catch (error : any) {
    console.error('Error saving product to MongoDB:', error);
    throw new Error(`Failed to store product in MongoDB: ${error.message}`);
  }
}
