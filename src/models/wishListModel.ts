// src/models/Wishlist.ts
import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for WishlistItem without note
interface IWishlistItem {
  productId: mongoose.Types.ObjectId;
  addedAt?: Date;
}

// Define the interface for Wishlist
interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  items: IWishlistItem[];
}

// Define the WishlistItem schema without note
const WishlistItemSchema: Schema<IWishlistItem> = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
});

// Define the Wishlist schema
const WishlistSchema: Schema<IWishlist> = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [WishlistItemSchema]
});

// Create and export the Wishlist model
const Wishlist = mongoose.model<IWishlist>('Wishlist', WishlistSchema);
export default Wishlist;
