// pages/AdminAllProducts.tsx

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FaTrash, FaEdit } from 'react-icons/fa';
import CustomDropdown from '@/components/customDropDown';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditProductModal from '@/components/editProductModal';

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

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default function AdminAllProducts() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedSubcategory, searchTerm]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/category', {
        headers: { 'x-api-key': API_KEY! },
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        const errorResult = await response.json();
        toast.error("Failed to fetch categories: " + errorResult.message);
      }
    } catch (error) {
      toast.error("Error fetching categories: " + error);
    }
  };

  const fetchProducts = async () => {
    try {
      const query = new URLSearchParams({
        category: selectedCategory,
        subcategory: selectedSubcategory,
        search: searchTerm,
      }).toString();
      const response = await fetch(`/api/products?${query}`, {
        headers: { 'x-api-key': API_KEY! },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        const errorResult = await response.json();
        toast.error("Failed to fetch products: " + errorResult.message);
      }
    } catch (error) {
      toast.error("Error fetching products: " + error);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find(cat => cat._id === selectedCategory);
      setSubcategories(category ? category.subcategories : []);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory, categories]);

  const fetchProductDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        headers: { 'x-api-key': API_KEY! },
      });

      if (response.ok) {
        const data = await response.json();
        setEditProduct(data);
        setSelectedCategory(data.category);
        setSelectedSubcategory(data.subcategory);
        const category = categories.find(cat => cat._id === data.category);
        setSubcategories(category ? category.subcategories : []);
        setShowEditModal(true);
      } else {
        const errorResult = await response.json();
        toast.error("Failed to fetch product details: " + errorResult.message);
      }
    } catch (error) {
      toast.error("Error fetching product details: " + error);
    }
  };

  const handleEditProduct = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY!,
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        toast.success("Product updated successfully!");
        setEditProduct(null);
        setShowEditModal(false);
        fetchProducts(); // Refresh the product list after editing
      } else {
        const result = await response.json();
        toast.error(result.message || "Failed to update product.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the product.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'x-api-key': API_KEY! },
      });

      if (response.ok) {
        toast.success("Product deleted successfully!");
        fetchProducts(); // Refresh the product list after deletion
      } else {
        const result = await response.json();
        toast.error(result.message || "Failed to delete product.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product.");
    }
  };

  return (
    <div className="grid place-items-center">
      <div className="w-[90%] lg:w-[50%] max-w-md bg-[#e8e0d4] px-4 py-8">
        <h2 className="text-lg font-bold mb-4">Products</h2>
        
        {/* Search Input */}
        <div className="mb-4">
          <Label htmlFor="search-input">Search Products</Label>
          <Input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or description"
            className="p-2 border rounded w-full"
          />
        </div>

        {/* Category Selector */}
        <div className="mb-4">
          <Label htmlFor="category-select">Filter by Category</Label>
          <CustomDropdown
            options={categories.map(cat => ({ value: cat._id, label: cat.name }))}
            value={selectedCategory}
            onChange={(option) => {
              setSelectedCategory(option.value);
              setSelectedSubcategory(""); // Reset subcategory when category changes
            }}
          />
        </div>

        {/* Subcategory Selector */}
        {selectedCategory && (
          <div className="mb-4">
            <Label htmlFor="subcategory-select">Filter by Subcategory</Label>
            <CustomDropdown
              options={subcategories.map(name => ({ value: name, label: name }))}
              value={selectedSubcategory}
              onChange={(option) => setSelectedSubcategory(option.value)}
            />
          </div>
        )}

        <ul className="list-disc mt-3 pl-5 font-normal">
          {products.map((product) => (
            <li key={product._id} className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <p><strong>{product.name}</strong></p>
                <p>Price: ${product.price}</p>
                <p>Discount: {product.discount}%</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => fetchProductDetails(product._id)} // Fetch product details
                  className="bg-transparent text-[#4d3d30] p-1 rounded"
                >
                  <FaEdit />
                </Button>
                <Button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="bg-transparent text-red-800 p-1 rounded"
                >
                  <FaTrash />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showEditModal && editProduct && (
        <EditProductModal
          isOpen={showEditModal}
          product={editProduct}
          categories={categories}
          subcategories={subcategories}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditProduct}
          onCategoryChange={(categoryId) => {
            setEditProduct(prev => prev ? { ...prev, category: categoryId } : null);
            const category = categories.find(cat => cat._id === categoryId);
            setSubcategories(category ? category.subcategories : []);
          }}
          onSubcategoryChange={(subcategory) => {
            setEditProduct(prev => prev ? { ...prev, subcategory } : null);
          }}
          onProductNameChange={(name) => {
            setEditProduct(prev => prev ? { ...prev, name } : null);
          }}
          onProductPriceChange={(price) => {
            setEditProduct(prev => prev ? { ...prev, price } : null);
          }}
          onProductDiscountChange={(discount) => {
            setEditProduct(prev => prev ? { ...prev, discount } : null);
          }}
          onProductDescriptionChange={(description) => {
            setEditProduct(prev => prev ? { ...prev, description } : null);
          }}
        />
      )}

      <ToastContainer />
    </div>
  );
}
