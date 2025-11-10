'use client';

import React, { useState } from "react";
import axios from "axios";
import { Search, X , ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter(); 

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setShowResults(true);
    try {
      const res = await axios.get(`/api/product/search?q=${encodeURIComponent(query)}`);
      setResults(res.data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = (pathUrl: string) => {
    router.push(`/products/${pathUrl}`);
    setShowResults(false);
    setQuery("");
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="w-full max-w-2xl mr-5 mx-auto relative">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center bg-white border border-gray-200 rounded-full  hover:shadow-md focus-within:border-gray-400 focus-within:shadow-lg transition-all duration-200">
          <div className="pl-2 2xl:pl-3 text-gray-400">
            <Search className=" w-4 2xl:w-5" />
          </div>
          <input
            type="text"
            placeholder="Search for products..."
            className="flex-1 px-3 py-2 text-xs 2xl:text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!e.target.value.trim()) {
                setShowResults(false);
              }
            }}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className=" mr-1 2xl:mr-3 absolute right-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Clear search"
            >
              <X className="text-gray-500 w-4 2xl:w-5 2xl:h-5" />
            </button>
          )}
        </div>
      </form>

      {showResults && (
        <div className="absolute w-sm 2xl:w-md mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[28rem] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block w-8 h-8 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-3"></div>
              <p className="text-gray-600 text-sm">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {results.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleRedirect(item.pathUrl)}
                  className="p-3 hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-16 h-16 bg-white rounded-lg overflow-hidden">
                      <img 
                        src={item.thumbnail || item.images?.[0]} 
                        alt={item.name}
                        className="w-full h-full object-contain"
                    
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm 2xl:text-base text-gray-900 group-hover:text-gray-700 transition-colors truncate">
                        {item.name}
                      </p>
                      {item.price && (
                        <p className="text-xs 2xl:text-sm font-sans text-gray-500 mt-0.5">
                          ₹{item.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0 text-gray-300 group-hover:text-gray-600 transition-colors">
                      <ChevronRight />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-700 font-semibold text-base">No products found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}