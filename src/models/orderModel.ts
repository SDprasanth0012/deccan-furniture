import mongoose, { Document, Model, Schema } from 'mongoose';

interface IOrderItem {
  productId: string; // Product identifier
  quantity: number; // Quantity of the product
  price: number; // Price of the product
  name: string; // Name of the product
  image: string; // Image URL of the product
}

interface IOrder extends Document {
  customerName: string; // Customer's name
  email: string; // Customer's email
  phone: string; // Customer's phone number
  items: IOrderItem[];
  address: string; // List of ordered items
  totalAmount: number; // Total amount for the order
  amountDue: number; // Amount due
  amountPaid: number; // Amount paid
  currency: string; // Currency type (e.g., INR)
  orderId: string; // Unique order ID
  paymentStatus: 'pending' | 'completed' | 'failed'; // Payment status
  status: 'created' | 'pending' | 'shipped' | 'delivered' | 'canceled'; // Order status
}

const OrderSchema: Schema<IOrder> = new Schema(
  {
    customerName: { type: String, required: true }, // Customer's name
    email: { type: String, required: true }, // Customer's email
    phone: { type: String, required: true }, // Customer's phone number
    items: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
      },
    ],
    address : { type: String, required: true },
    totalAmount: { type: Number, required: true },
    amountDue: { type: Number, required: true },
    amountPaid: { type: Number, required: true, default: 0 },

    currency: { type: String, required: true, default: 'INR' },
    orderId: { type: String, required: true, unique: true }, // Unique order ID
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['created',  'shipped', 'delivered', 'canceled'],
      default: 'created',
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
