"use client";

import React, { useEffect, useState } from "react";
import Carousel from "@/components/carousel";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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

// const SkeletonCard = () => (
//   <div className="border rounded-lg overflow-hidden shadow-sm animate-pulse">
//     <div className="w-full h-48 bg-[#e8e0d4]"></div>
//     <div className="p-4 space-y-2">
//       <div className="w-3/4 h-4 bg-[#e8e0d4]"></div>
//       <div className="w-1/2 h-4 bg-[#e8e0d4]"></div>
//       <div className="w-1/4 h-6 bg-[#e8e0d4]"></div>
//     </div>
//   </div>
// );

const SkeletonCard = () => (
  <div className="border rounded-lg overflow-hidden shadow-sm p-4">
    {/* Image Skeleton */}
    <div style={{ backgroundColor: '#e8e0d4' }}>
      <Skeleton height={192} width="100%" baseColor="#e8e0d4" highlightColor="#f2ede7" />
    </div>

    {/* Text Skeletons */}
    <div className="mt-4 space-y-2">
      <Skeleton height={16} width="75%" baseColor="#e8e0d4" highlightColor="#f2ede7" />
      <Skeleton height={16} width="50%" baseColor="#e8e0d4" highlightColor="#f2ede7" />
      <Skeleton height={24} width="25%" baseColor="#e8e0d4" highlightColor="#f2ede7" />
    </div>
  </div>
);

export default function LandingPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});

  const [loading, setLoading] = useState(true);

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
      if (categories.length === 0) return;
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categories]);

  return (
    <div className="container mx-auto px-4">
      {/* Carousel */}
      <Carousel />
      
      {/* Category-wise Products */}
      {loading
        ? Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-3xl font-normal text-center mb-4 border-t border-[#4d3d30] pt-4 animate-pulse bg-[#e8e0d4] h-8 rounded"></h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <SkeletonCard key={idx} />
                ))}
              </div>
            </div>
          ))
        : Object.keys(productsByCategory).map((category, index) => (
            <div key={category} className="mb-8">
              <div className="flex justify-between border-t border-[#4d3d30]">
              {/*category title*/}
              <h2
                className="text-3xl font-normal w-full lg:w-fit  text-center mb-4  pt-4"
                style={{ color: "#4d3d30" }}
              >
                {category}
              </h2>
              {/* Explore More Button */}
              <div className="text-center hidden lg:block  w-fit mt-4">
                  <Link href={`/products?category=${categories[index]._id}`}>
                    <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#4d3d30] text-white rounded-full hover:bg-[#3b2f25] transition">
                      <span>Explore More</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 9l4-4m0 0l4 4m-4-4v14"
                        />
                      </svg>
                    </button>
                  </Link>
                </div>
              </div>
              {/* product grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {loading
                  ? Array.from({ length: 4 }).map((_, idx) => <SkeletonCard key={idx} />)
                  : productsByCategory[category]?.slice(0, 4).map((product) => (
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
              {/* explore more button for mobile devices*/}
              <div className="text-center  flex justify-center lg:hidden    mt-4">
                  <Link href={`/products?category=${categories[index]._id}`}>
                  <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#4d3d30] text-white rounded-full hover:bg-[#3b2f25] transition">
    <span className="text-[10px]">Explore More</span>
    <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  strokeWidth={2}
  stroke="currentColor"
  className="w-4 h-4"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M9 5l7 7-7 7"
  />
</svg>

  </button>
                  </Link>
                </div>
            </div>
          ))}
    </div>
  );
}
