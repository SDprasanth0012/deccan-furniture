import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const schema = z.object({
  name: z.string().min(1, "Category name is required").max(32, "Name must be 32 characters or less"),
  subcategories: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

const API_KEY = process.env.NEXT_PUBLIC_API_KEY; // Ensure this is set in your .env file

const SubcategoryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}> = ({ isOpen, onClose, onAdd }) => {
  const [subcatName, setSubcatName] = useState("");

  const handleAddSubcategory = () => {
    if (subcatName.trim()) {
      onAdd(subcatName.trim());
      setSubcatName("");
      onClose();
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#f4f0ea] p-6 rounded shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-bold mb-4">Add Subcategory</h3>
        <div className="mb-4">
          <Label htmlFor="subcat-name">Subcategory Name</Label>
          <Input
            id="subcat-name"
            value={subcatName}
            onChange={(e) => setSubcatName(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button onClick={handleAddSubcategory} className="bg-[#4d3d30] text-[#f4f0ea]">Add</Button>
          <Button onClick={onClose} className="bg-[#f4f0ea] text-[#4d3d30]">Cancel</Button>
        </div>
      </div>
    </div>
  ) : null;
};

export default function CategoryManager() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [editData, setEditData] = useState<{ id: string, name: string, subcategories: string[] } | null>(null);
  const [categories, setCategories] = useState<{ _id: string; name: string; subcategories: string[] }[]>([]);

  useEffect(() => {
    fetchCategories(); // Initial fetch on component mount
  }, []);

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
        const errorResult = await response.json();
        toast.error("Failed to fetch categories: " + errorResult.message);
      }
    } catch (error) {
      toast.error("Error fetching categories: " + error);
    }
  };

  const handleAddCategory = async () => {
    if (formData) {
      try {
        const response = await fetch("/api/category", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY!,
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast.success("Category added successfully!");
          setFormData(null);
          fetchCategories(); // Refetch categories
        } else {
          const result = await response.json();
          toast.error(result.message || "Failed to add category.");
        }
      } catch (error) {
        toast.error("An error occurred while adding the category.");
      }
    }
  };

  const handleSubmitForm: SubmitHandler<FormData> = (data) => {
    setFormData(data); // Store form data for confirmation
    handleAddCategory(); // Directly add category
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/category/${id}`, {
        method: "DELETE",
        headers: {
          "x-api-key": API_KEY!,
        },
      });

      if (response.ok) {
        toast.success("Category deleted successfully!");
        fetchCategories(); // Refetch categories
      } else {
        const result = await response.json();
        toast.error(result.message || "Failed to delete category.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the category.");
    }
  };

  const handleEdit = async () => {
    if (editData) {
      try {
        const response = await fetch(`/api/category/${editData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY!,
          },
          body: JSON.stringify(editData),
        });

        if (response.ok) {
          toast.success("Category updated successfully!");
          setEditData(null);
          fetchCategories(); // Refetch categories
        } else {
          const result = await response.json();
          toast.error(result.message || "Failed to update category.");
        }
      } catch (error) {
        toast.error("An error occurred while updating the category.");
      }
    }
    setShowEditModal(false);
  };

  const handleAddSubcategory = (name: string) => {
    if (editData) {
      setEditData({
        ...editData,
        subcategories: [...(editData.subcategories || []), name],
      });
    }
  };

  const handleEditSubcategory = (index: number) => {
    if (editData) {
      const newSubcategory = prompt("Edit subcategory:", editData.subcategories[index]);
      if (newSubcategory) {
        const updatedSubcategories = [...(editData.subcategories || [])];
        updatedSubcategories[index] = newSubcategory;
        setEditData({
          ...editData,
          subcategories: updatedSubcategories,
        });
      }
    }
  };

  const handleDeleteSubcategory = (index: number) => {
    if (editData) {
      const updatedSubcategories = (editData.subcategories || []).filter((_, i) => i !== index);
      setEditData({
        ...editData,
        subcategories: updatedSubcategories,
      });
    }
  };

  return (
    <div className="grid place-items-center">
      <div className="w-[90%] lg:w-[50%] max-w-md bg-[#e8e0d4] px-4 py-8">
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
          <h2 className="text-lg font-bold">Add Category</h2>
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>
          <Button type="submit">Add Category</Button>
        </form>

        {showEditModal && editData && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[#f4f0ea] p-6 rounded shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-bold mb-4">Edit Category</h3>
              <div className="mb-4">
                <Label htmlFor="edit-name">Category Name</Label>
                <Input
                  id="edit-name"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <h4 className="text-md font-semibold">Subcategories</h4>
                {editData.subcategories && editData.subcategories.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {editData.subcategories.map((subcat, index) => (
                      <li key={index} className="flex items-center justify-between">
                        {subcat}
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => handleEditSubcategory(index)}
                            className="bg-transparent text-[#4d3d30] p-1 rounded"
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            onClick={() => handleDeleteSubcategory(index)}
                            className="bg-transparent text-red-800 p-1 rounded"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No subcategories added yet.</p>
                )}
              </div>
              <div className="flex justify-start space-x-2">
                <Button
                  onClick={() => setShowSubcategoryModal(true)}
                  className="bg-[#4d3d30] text-[#f4f0ea]"
                >
                  Add Subcategory
                </Button>
                <Button onClick={handleEdit} className="bg-[#4d3d30] text-[#f4f0ea]">Save</Button>
                <Button onClick={() => setShowEditModal(false)} className="bg-[#f4f0ea] text-[#4d3d30]">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        <SubcategoryModal
          isOpen={showSubcategoryModal}
          onClose={() => setShowSubcategoryModal(false)}
          onAdd={handleAddSubcategory}
        />

        <ToastContainer 
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>

      <div className="w-[90%] lg:w-[50%] max-w-md bg-[#e8e0d4] px-4 py-4 mt-8">
        <h2 className="text-lg font-bold">Categories</h2>
        <ul className="list-disc mt-3 pl-5 font-normal">
          {categories.map((category) => (
            <li key={category._id} className="flex items-center justify-between">
              {category.name}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => {
                    setEditData({ id: category._id, name: category.name, subcategories: category.subcategories });
                    setShowEditModal(true);
                  }}
                  className="bg-transparent text-[#4d3d30] p-1 rounded"
                >
                  <FaEdit />
                </Button>
                <Button
                  onClick={() => handleDelete(category._id)}
                  className="bg-transparent text-red-800 p-1 rounded"
                >
                  <FaTrash />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
