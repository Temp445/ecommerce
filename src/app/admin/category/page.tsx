"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  Plus,
  Edit3,
  Trash2,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

const CategoryPage = () => {

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);


  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/category");
      setCategories(res.data.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load categories")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      setDeletingId(id);
      await axios.delete(`/api/category/${id}`);
      toast.success("Category deleted successfully!")
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete category.")
    } finally {
      setDeletingId(null);
    }
  };

  if (!loading && categories.length === 0) {
    return <p className="text-center text-gray-500">No categories found.</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ">
            <div className="leading-none ">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Product Categories </h1>
            </div>
            <Link
              href="/admin/category/upload"
              className="flex items-center bg-gray-900 text-white px-5 py-3 rounded  transition-all duration-200 shadow-lg hover:shadow-xl font-medium transform "
            >
              <Plus className="w-5 h-5 mr-2" /> Add Category
            </Link>
          </div>

        </div>

        {loading ? (
          <div>
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-5 border border-gray-200 rounded-lg mb-4 animate-pulse"
              >
                <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0"></div>
                <div className="flex-1 min-w-0 border-gray-300 border-l pl-3">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
            </div>
        ) : (

          <div className="bg-white rounded shadow-xl overflow-hidden border border-gray-100">
            {categories.map((cat, index) => (
              <div
                key={cat._id}
                className={`flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors duration-200 ${
                  index !== categories.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                  {cat.CatImage ? (
                    <img
                      src={cat.CatImage}
                      alt={cat.Name}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                  )}
                </div>

                <div className="flex-1 min-w-0 border-l pl-3">
                  <h3 className="font-bold text-gray-800 text-lg truncate">{cat.Name}</h3>
                  <p className="text-sm text-gray-400">Category ID: {cat._id}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/admin/category/update/${cat._id}`}
                    className="flex items-center text-sm bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    <Edit3 className="w-4 h-4 mr-1.5" /> Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(cat._id)}
                    disabled={deletingId === cat._id}
                    className="flex items-center text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 disabled:opacity-70 font-medium shadow-md hover:shadow-lg"
                  >
                    {deletingId === cat._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
