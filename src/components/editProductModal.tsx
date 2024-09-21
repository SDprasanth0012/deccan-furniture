// EditProductModal.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CustomDropdown from '@/components/customDropDown';
import { FaEdit } from 'react-icons/fa';

type Product = {
  _id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  discount: number;
  description: string;
};

type Category = {
  _id: string;
  name: string;
  subcategories: string[];
};

type EditProductModalProps = {
  isOpen: boolean;
  product: Product | null;
  categories: Category[];
  subcategories: string[];
  onClose: () => void;
  onSave: (product: Product) => void;
  onCategoryChange: (categoryId: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
  onProductNameChange: (name: string) => void;
  onProductPriceChange: (price: number) => void;
  onProductDiscountChange: (discount: number) => void;
  onProductDescriptionChange: (description: string) => void;
};

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  product,
  categories,
  subcategories,
  onClose,
  onSave,
  onCategoryChange,
  onSubcategoryChange,
  onProductNameChange,
  onProductPriceChange,
  onProductDiscountChange,
  onProductDescriptionChange,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#f4f0ea] p-6 rounded shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-bold mb-4">Edit Product</h3>
        
        {/* Category Selector */}
        <div className="mb-4">
          <Label htmlFor="edit-category">Category</Label>
          <CustomDropdown
            options={categories.map(cat => ({ value: cat._id, label: cat.name }))}
            value={product.category}
            onChange={(option) => onCategoryChange(option.value)}
          />
        </div>

        {/* Subcategory Selector */}
        {product.category && (
          <div className="mb-4">
            <Label htmlFor="edit-subcategory">Subcategory</Label>
            <CustomDropdown
              options={subcategories.map(name => ({ value: name, label: name }))}
              value={product.subcategory}
              onChange={(option) => onSubcategoryChange(option.value)}
            />
          </div>
        )}

        <div className="mb-4">
          <Label htmlFor="edit-name">Product Name</Label>
          <Input
            id="edit-name"
            value={product.name}
            onChange={(e) => onProductNameChange(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="edit-price">Price</Label>
          <Input
            id="edit-price"
            type="number"
            value={product.price}
            onChange={(e) => onProductPriceChange(+e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="edit-discount">Discount</Label>
          <Input
            id="edit-discount"
            type="number"
            value={product.discount}
            onChange={(e) => onProductDiscountChange(+e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="edit-description">Description</Label>
          <textarea
            id="edit-description"
            value={product.description}
            onChange={(e) => onProductDescriptionChange(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
        <Button onClick={() => onSave(product)} className="bg-[#4d3d30] text-white">
          Save Changes
        </Button>
        <Button
          onClick={onClose}
          className="bg-red-500 text-white ml-2"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditProductModal;
