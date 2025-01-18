"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import ProductCard from "@/components/productCard";
import CustomDropdown from "@/components/customDropDown";
import Loading from "./loading";

type Review = {
  name: string;
  rating: number;
  comment: string;
  user: string;
};

type Product = {
  _id: string;
  name: string;
  image: string[];
  category: string;
  subcategory: string;
  description: string;
  price: number;
  discount: number;
  features: string[];
  reviews: Review[];
  rating: number;
  numReviews: number;
};

type Category = {
  _id: string;
  name: string;
  subcategories: string[];
};

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const sortOptions = [
  { value: "", label: "Sort by" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function  ProductPageContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || ""; // Fetch category from the URL
  console.log(initialCategory)
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const [loading, setLoading] = useState(true);
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
          setCategories([{ _id: "", name: "ALL PRODUCTS", subcategories: [] }, ...data]);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/products?category=${selectedCategory}&subcategory=${selectedSubcategory}&search=${searchTerm}`,
          {
            headers: {
              "x-api-key": API_KEY!,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const sortedProducts = [...data];
          if (sortOption === "price-asc") {
            sortedProducts.sort((a, b) => a.price - b.price);
          } else if (sortOption === "price-desc") {
            sortedProducts.sort((a, b) => b.price - a.price);
          }
    console.log("loading products"+selectedCategory);

          setProducts(sortedProducts);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedCategory, selectedSubcategory, searchTerm, sortOption]);

  return (
    <div>
      { 
      loading? (
        <Loading />
      ) 
    : (<div className="container mx-auto px-4">
      {/* Category Section */}
      <div className="bg-transparent mb-4 py-4">
        <div className="mb-4 text-center">
          <h2
            className="text-4xl lg:text-6xl font-normal border-t border-[#4d3d30] pt-4"
            style={{ color: "#4d3d30" }}
          >
            {selectedCategory
              ? categories.find((cat) => cat._id === selectedCategory)?.name
              : "ALL PRODUCTS"}
            
          </h2>
        </div>

        {/* List of Categories */}
        <div className="flex flex-wrap justify-start space-x-2 ">
          {categories.map((category) => (
            <div
              key={category._id}
              onClick={() => {
                setSelectedCategory(category._id);
                setSelectedSubcategory("");
              }}
              className={`px-3 py-1 mb-2 rounded-full border border-[#4d3d30] text-[#4d3d30] cursor-pointer ${
                selectedCategory === category._id
                  ? "bg-[#4d3d30] text-[#f4f0ea]"
                  : "bg-transparent hover:bg-[#e8e0d4] hover:text-[#4d3d30]"
              }`}
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>
      <div className="flex ">
      {/* Sorting Dropdown */}
      <div className="mb-4 w-2/5 mr-auto">
        <CustomDropdown
          options={sortOptions}
          value={sortOption}
          placeholder="Sort by"
          onChange={(option) => setSortOption(option.value)}
        />
      </div>

      {/* Search Bar */}
      <div className="mb-4 w-3/4 ml-auto max-w-[200px]">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-[#4d3d30] px-3 py-2 rounded-full"
          />
          <FaSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#4d3d30]" />
        </div>
      </div>
      </div>
      {/* Subcategory Section */}
      {selectedCategory && (
        <div>
        <div className="text-3xl text-center lg:text-6xl font-normal border-t border-[#4d3d30] mb-4 pt-4" style={{ color: "#4d3d30" }}>
  {selectedSubcategory && `${selectedSubcategory}`}
</div>
        <div className="mb-4 overflow-x-auto whitespace-nowrap">
         
          <div className="flex space-x-2">
            {categories
              .find((cat) => cat._id === selectedCategory)
              ?.subcategories.map((subcat, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedSubcategory(subcat)}
                  className={`inline-block px-3 py-1 rounded-full border border-[#4d3d30] text-[#4d3d30] cursor-pointer ${
                    selectedSubcategory === subcat
                      ? "bg-[#4d3d30] text-[#f4f0ea]"
                      : "bg-transparent hover:bg-[#e8e0d4] hover:text-[#4d3d30]"
                  }`}
                >
                  {subcat}
                </div>
              ))}
          </div>
        </div>
        </div>
      )}

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="text-center col-span-full">No products found</p>
        )}
      </div>
    </div>)
     }
    </div>
  );
}

export default  function ProductPage() {
  return (
   <Suspense >

      <ProductPageContent />
   </Suspense>

  );
}