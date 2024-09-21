import mongoose, { Document, Schema } from 'mongoose';

// Review Schema
const reviewSchema = new Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// Product Schema Interface
interface IProduct extends Document {
  name: string;
  image: string[];
  category: mongoose.Types.ObjectId; // Reference to Category
  subcategory: string; // Array of Subcategory strings
  description: string;
  price: number;
  discount: number;
  features: string[];
  reviews: typeof reviewSchema[]; // Array of reviewSchema
  rating: number;
  numReviews: number;
}

// Product Schema
const productSchema: Schema<IProduct> = new Schema({
  name: { type: String, required: true },
  image: [{ type: String, required: true }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: String, required: true }, // Array of subcategories
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  discount: { type: Number, default: 0, required: true },
  features: [{ type: String }],
  reviews: [reviewSchema],
  rating: { type: Number, default: 4.5 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

// Exporting Product Model
const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;
