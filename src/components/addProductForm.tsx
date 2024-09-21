"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UploadToS3 } from "@/lib/s3";
import { createProduct } from "@/actions/products";
import CustomDropdown from "@/components/customDropDown";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  images: z.array(z.string().min(1, "At least one image is required")),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(1, "Price is required"),
  discount: z.number().min(0, "Discount must be at least 0").max(100, "Discount cannot exceed 100"),
  features: z.array(z.string().min(1, "Feature cannot be empty")).min(1, "At least one feature is required"),
});

type ProductFormInputs = z.infer<typeof productSchema>;

const MAX_FILE_SIZE = 100 * 1024; // 100KB in bytes

export default function AddProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string; subcategories: string[] }[]>([]);
  const [subcategories, setSubcategories] = useState<{ value: string; label: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [features, setFeatures] = useState<string[]>([""]); // Initialize with one empty feature
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
  } = useForm<ProductFormInputs>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      features: [""] // Initialize with one empty feature
    },
  });

  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
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
          console.error("Failed to fetch categories.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Fetch subcategories based on the selected category
    const fetchSubcategories = () => {
      if (!selectedCategory) return;
      const category = categories.find(cat => cat._id === selectedCategory);
      if (category) {
        setSubcategories(category.subcategories.map(subcategory => ({
          value: subcategory,
          label: subcategory
        })));
      } else {
        setSubcategories([]);
      }
    };

    fetchSubcategories();
  }, [selectedCategory, categories]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles: File[] = [];
    const previews: string[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name} exceeds the size limit of 100KB.`);
      } else {
        validFiles.push(file);
        previews.push(URL.createObjectURL(file));
      }
    });

    setSelectedFiles(validFiles);
    setImagePreviews(previews);
    setFileErrors(errors);

    // Update form values
    setValue("images", validFiles.map(file => URL.createObjectURL(file)));
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

    // Update file input
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      updatedFiles.forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }

    setSelectedFiles(updatedFiles);
    setImagePreviews(updatedPreviews);

    // Update form values
    setValue("images", updatedFiles.map(file => URL.createObjectURL(file)));
  };

  const addFeature = () => {
    setFeatures(prevFeatures => [...prevFeatures, ""]); // Ensure the array is properly updated
  };

  const removeFeature = (index: number) => {
    if (features.length > 1) { // Prevent removing the last feature
      setFeatures(prevFeatures => prevFeatures.filter((_, i) => i !== index));
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFeatures(prevFeatures => {
      const updatedFeatures = [...prevFeatures];
      updatedFeatures[index] = value;
      return updatedFeatures;
    });
    setValue("features", features); // Update form values
  };

  const onSubmit: SubmitHandler<ProductFormInputs> = async (data) => {
    setIsSubmitting(true);

    try {
      // Upload files and get URLs
      const imageUrls = await UploadToS3(selectedFiles);
      data = { ...data, images: imageUrls };

      await createProduct(data);
      console.log("Product created in db successfully");
      console.log(data)
      reset();

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setImagePreviews([]);
      setSelectedFiles([]);
      setFeatures([""]); // Reset features to initial state
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = categories.map(category => ({
    value: category._id,
    label: category.name,
  }));

  const subcategoryOptions = subcategories.map(subcategory => ({
    value: subcategory.value,
    label: subcategory.label,
  }));

  return (
    <div className="grid place-items-center">
      <div className="w-[90%] lg:w-[50%] max-w-md bg-[#e8e0d4] px-4 py-8 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4">Add Product</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              {...register("name")}
              type="text"
              placeholder="Enter product name"
              className="mt-1"
            />
            {errors.name && <p className="text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="images">Product Images</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              className=""
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            {fileErrors.length > 0 && (
              <div className="text-red-600 mt-2">
                {fileErrors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
            {imagePreviews.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative w-32 h-32">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover rounded border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
            {errors.images && <p className="text-red-600">{errors.images.message}</p>}
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  options={categoryOptions}
                  value={field.value}
                  onChange={(option) => {
                    field.onChange(option.value);
                    setSelectedCategory(option.value); // Fetch subcategories based on the selected category
                  }}
                />
              )}
            />
            {errors.category && <p className="text-red-600">{errors.category.message}</p>}
          </div>

          <div>
            <Label htmlFor="subcategory">Subcategory</Label>
            <Controller
              name="subcategory"
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  options={subcategoryOptions}
                  value={field.value}
                  onChange={(option) => field.onChange(option.value)}
                />
              )}
            />
            {errors.subcategory && <p className="text-red-600">{errors.subcategory.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter product description"
              className="mt-1"
            />
            {errors.description && <p className="text-red-600">{errors.description.message}</p>}
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              {...register("price", { valueAsNumber: true })}
              type="number"
              placeholder="Enter price"
              className="mt-1"
            />
            {errors.price && <p className="text-red-600">{errors.price.message}</p>}
          </div>

          <div>
            <Label htmlFor="discount">Discount (%)</Label>
            <Input
              id="discount"
              {...register("discount", { valueAsNumber: true })}
              type="number"
              placeholder="Enter discount"
              className="mt-1"
            />
            {errors.discount && <p className="text-red-600">{errors.discount.message}</p>}
          </div>

          <div>
            <Label>Features</Label>
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder="Feature"
                  className="mt-1"
                />
                <Button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="bg-red-500 text-white"
                >
                  Remove
                </Button>
              </div>
            ))}
            {errors.features && <p className="text-red-600">{errors.features.message}</p>}
            <Button
              type="button"
              onClick={addFeature}
              className="mt-2"
            >
              Add Feature
            </Button>
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-4">
            {isSubmitting ? "Adding..." : "Add Product"}
          </Button>
        </form>
      </div>
    </div>
  );
}
