// src/models/Cart.ts
import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for CartItem
interface ICartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

// Define the interface for Cart
interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
}

// Define the CartItem schema
const CartItemSchema: Schema<ICartItem> = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
});

// Define the Cart schema
const CartSchema: Schema<ICart> = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [CartItemSchema],
});

// Create and export the Cart model
const Cart = mongoose.model<ICart>('Cart', CartSchema);
export default Cart;
