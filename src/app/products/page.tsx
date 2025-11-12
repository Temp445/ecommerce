"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, Search, LayoutGrid, List, Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import FiltersSidebar from "@/Components/ProductPage/FiltersSidebar";
import ProductCard from "@/Components/ProductPage/ProductCard";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ hide filters by default on mobile
  const [showFilters, setShowFilters] = useState(false);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState("featured");

  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategories([cat]);
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [products, selectedCategories, priceRange, sortBy]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/product");
      const data = res.data?.data || [];
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category?._id)
      );
    }

    filtered = filtered.filter((p) => {
      const price = p.discountPrice || p.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sortBy) {
      case "price-low":
        filtered.sort(
          (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price)
        );
        break;
      case "price-high":
        filtered.sort(
          (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price)
        );
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 100000]);
    setSortBy("featured");
    router.push("/products");
  };

  const categories = Array.from(
    new Map(
      products
        .filter((p) => p.category?._id)
        .map((p) => [p.category._id, p.category])
    ).values()
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Loader2 className="animate-spin text-gray-600 mb-4" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="container mx-auto px-3 sm:px-6 py-8">
        <div className="flex gap-8 relative">
          {/* Sidebar */}
          <FiltersSidebar
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            categories={categories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            clearFilters={clearFilters}
          />

          {/* Main Section */}
          <main className="flex-1">
            <div className="flex flex-wrap items-center justify-between mb-6 bg-white border border-slate-200 rounded p-4 shadow-sm">
              <div className="text-xl font-medium">Our Products</div>

              {/* 👇 Show Filters Button (Mobile only) */}
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100 transition lg:hidden"
              >
                <Filter size={18} />
                Filters
              </button>

              {/* View Mode Switch (Desktop only) */}
              <div className="md:flex items-center gap-2 hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg border ${
                    viewMode === "grid"
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid size={18} />
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg border ${
                    viewMode === "list"
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                  }`}
                  title="List View"
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Product Grid/List */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-slate-400" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    No products found
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Try adjusting your filters or search query.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                    viewMode={viewMode}
                    userId={user?._id}
                  />
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
