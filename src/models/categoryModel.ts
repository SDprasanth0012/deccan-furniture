import mongoose, { Document, Schema } from 'mongoose';

interface ICategory extends Document {
  name: string;
  subcategories: string[]; // Array of references to Subcategory documents
}

const categorySchema: Schema<ICategory> = new Schema({
  name: { type: String, required: true, unique: true },
  subcategories: [{ type: String, ref: 'Subcategory',  default: [] }],
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);

export default Category;
