"use client";

import React, { useEffect, useState } from "react";
import Carousel from "@/components/carousel";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  discount: number;
  description: string;
  image: string[];
};

type Category = {
  _id: string;
  name: string;
};

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default function LandingPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category", {
          headers: {
            "x-api-key": API_KEY!,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products for each category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const categoryProducts: Record<string, Product[]> = {};
        for (const category of categories) {
          const response = await fetch(`/api/products?category=${category._id}&limit=4`, {
            headers: {
              "x-api-key": API_KEY!,
            },
          });
          if (response.ok) {
            const data = await response.json();
            categoryProducts[category.name] = data;
          }
        }
        setProductsByCategory(categoryProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (categories.length > 0) {
      fetchProducts();
    }
  }, [categories]);

  return (
    <div className="container mx-auto px-4">
      {/* Carousel */}
      <Carousel />

      {/* Category-wise Products */}
      {Object.keys(productsByCategory).map((category) => (
        <div key={category} className="mb-8">
          <h2
            className="text-3xl font-normal text-center mb-4 border-t border-[#4d3d30] pt-4"
            style={{ color: "#4d3d30" }}
          >
            {category}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productsByCategory[category].slice(0, 4).map((product) => (
              <Link key={product._id} href={`/products/${product._id}`}>
                <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <img
                    src={product.image[0] || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.description}</p>
                    <div className="mt-2">
                      <span className="text-[#4d3d30] font-bold">
                        ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                      </span>
                      {product.discount > 0 && (
                        <span className="ml-2 line-through text-gray-400">
                          ₹{product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
