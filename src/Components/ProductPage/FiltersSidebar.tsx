'use client';

import React from "react";
import { Filter, X } from "lucide-react";

interface Category {
  _id?: string;
  Name: string;
}

interface FiltersSidebarProps {
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
  categories: any[];
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  priceRange: [number, number];
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  clearFilters: () => void;
}

export default function FiltersSidebar({
  showFilters,
  setShowFilters,
  categories,
  selectedCategories,
  setSelectedCategories,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  clearFilters,
}: FiltersSidebarProps) {
  const toggleCategory = (categoryId?: string) => {
    if (!categoryId) return;
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Normalize & deduplicate categories
  const normalized = categories
    .map((item) => {
      if (item?.category?._id) return { _id: item.category._id, Name: item.category.Name };
      if (item?._id) return { _id: item._id, Name: item.Name };
      return null;
    })
    .filter(Boolean) as Category[];

  const uniqueCategories = Array.from(new Map(normalized.map((c) => [c._id, c])).values());

  return (
    <>
      {/* Mobile Overlay */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}

      <aside
        className={`fixed lg:static top-0 right-0 z-50 lg:z-auto bg-white lg:bg-transparent
        w-72 max-w-full h-full lg:h-auto shadow-xl lg:shadow-none transition-transform
        duration-300 ease-in-out border-l border-slate-200 lg:border-none
        ${showFilters ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}
      >
        <div className="bg-white rounded-none lg:rounded-2xl shadow-none lg:shadow-sm border-0 lg:border border-slate-200 p-6 h-full lg:h-auto overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Filter size={20} /> Filters
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-gray-800"
              >
                Clear All
              </button>
              <button
                className="lg:hidden p-1 rounded-lg hover:bg-slate-100"
                onClick={() => setShowFilters(false)}
              >
                <X size={18} className="text-slate-500" />
              </button>
            </div>
          </div>

          {/* Category Section */}
          {uniqueCategories.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">
                Categories
              </h3>
              <div className="space-y-2">
                {uniqueCategories.map((category) => (
                  <label
                    key={category._id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={
                        category._id ? selectedCategories.includes(category._id) : false
                      }
                      onChange={() => toggleCategory(category._id)}
                      className="w-4 h-4 accent-gray-900 rounded border-slate-300"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                      {category.Name || "Unnamed"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">
              Price Range
            </h3>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-sm text-slate-600">
                <span>₹{priceRange[0].toLocaleString()}</span>
                <span>₹{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">
              Sort By
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm
                transition"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </aside>
    </>
  );
}
