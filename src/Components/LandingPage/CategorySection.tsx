'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function CategorySection() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/category");
      setCategories(res.data.data || []);
    } catch (err: any) {
      console.error(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
 
  return (
    <section className="py-16  bg-gray-900">
      <div className="container mx-auto px-4 md:px-8 ">
        <div className="mb-12">
          <h2 className=" text-2xl md:text-4xl text-white mb-2">Find by Category</h2>
          <p className="text-gray-600">Discover our wide selection of products</p>
        </div>

        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2  md:gap-6">
            {categories.slice(0, 6).map((cat) => (
              <Link
                href={`/category/${encodeURIComponent(cat.Name)}`}
                key={cat._id}
                className="group"
              >
                <div className="bg-white rounded overflow-hidden border border-gray-200  transition-all duration-300 shadow-sm hover:shadow-md">
                  <div className="relative w-full h-32 md:h-40 bg-white flex items-center justify-evenly overflow-hidden">
                    <img
                      src={cat.CatImage}
                      alt={cat.Name}
                      className=" h-28 md:h-36 object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-4 text-center border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                      {cat.Name}
                    </h3>
                    <button className="mt-3 w-full py-2 px-3 bg-gray-900 text-white text-xs font-medium rounded-full transition-colors duration-300">
                      View
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && categories.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No categories found</p>
          </div>
        )}
      </div>
    </section>
  );
}