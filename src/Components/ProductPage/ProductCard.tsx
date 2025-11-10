import React from "react";
import { useRouter } from "next/navigation";
import AddToCartButton from "@/Components/Button/AddToCartButton";

export default function ProductCard({
  product,
  viewMode,
  userId,
}: {
  product: any;
  viewMode: "grid" | "list";
  userId?: string;
}) {
  const router = useRouter();

  const discountPercentage = product.discountPrice > 0 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div
      className={`bg-white border border-slate-200 rounded shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group ${
        viewMode === "list" ? "flex" : "flex flex-col"
      }`}
    >
      <div
        onClick={() => router.push(`/products/${product.pathUrl}`)}
        className={`relative bg-slate-50 cursor-pointer overflow-hidden ${
          viewMode === "list" ? "w-64 flex-shrink-0" : "w-full"
        }`}
      >
        {discountPercentage > 0 && (
          <span className="absolute top-3 left-3 z-10 text-xs font-bold text-white bg-emerald-600 px-3 py-1.5 rounded shadow-md">
            {discountPercentage}% OFF
          </span>
        )}
        <span className="absolute top-3 right-2  pr-2 text-red-500 z-10">{product.stock === 0 ? "Out of stock" : "" }</span>

        {product.thumbnail ? (
          <img
            src={product.thumbnail || product.images?.[0]}
            alt={product.name}
            className={`w-full object-contain bg-white group-hover:scale-105 transition-transform duration-500 ${
              viewMode === "list" ? "h-80" : "h-72"
            }`}
          />
        ) : (
          <div className={`flex items-center justify-center bg-white ${
            viewMode === "list" ? "h-full" : "h-72"
          }`}>
            <svg 
              className="w-16 h-16 text-slate-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
          </div>
        )}
      </div>

      <div className={`p-6 flex flex-col ${viewMode === "list" ? "flex-1" : ""}`}>
        <h2
          onClick={() => router.push(`/products/${product.pathUrl}`)}
          className="text-lg font-medium text-slate-800 mb-2 cursor-pointer hover:text-gray-900 transition line-clamp-2 leading-snug"
        >
          {product.name}
        </h2>

        <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-1 leading-relaxed">
          {product.description || "No description available."}
        </p>

        <div className="mb-4 font-sans">
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-2xl font-medium text-slate-900">
              ₹{(product.discountPrice || product.price)?.toLocaleString()}
            </p>
            {product.discountPrice > 0 && (
              <p className="text-base text-slate-400 line-through">
                ₹{product.price?.toLocaleString()}
              </p>
            )}
                {product.discountPrice > 0 && (
            <p className="text-xs text-emerald-600 font-medium">
              You save ₹{(product.price - product.discountPrice)?.toLocaleString()}
            </p>
          )}
          </div>
      
        </div>

        <AddToCartButton product={product} userId={userId}  disabled={product.stock <= 0} className={`text-white bg-gray-900 hover:bg-gray-950 transition disabled:opacity-50 ${
    product.stock <= 0 ? "cursor-not-allowed opacity-60" : ""
  }`} />
      </div>
    </div>
  );
}