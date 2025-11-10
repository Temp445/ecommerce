"use client";

import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import AddToCartButton from "../Button/AddToCartButton";
import { useAuth } from "@/context/AuthProvider";

const PopularProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/product");
      const data = res.data?.data || [];
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  return (
    <div className="bg-white px-4 md:px-8 lg:px-6 py-10 container mx-auto">
      <div className="pb-8 flex justify-between">
        <h2 className="text-3xl md:text-4xl font-medium text-gray-900">
          Most Popular Products
        </h2>

        <Link
          href="/"
          className="bg-gray-900 text-white pl-3 pr-1 flex items-center rounded text-sm"
        >
          View All <ChevronRight className="w-5 h-5" />{" "}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products
          .slice()
          .reverse()
          .map((product) => (
            <div
              key={product._id}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl border transition-all duration-300 bg-white"
            >
              <div className="relative w-full   overflow-hidden">
                <img
                  src={
                    product.thumbnail ||
                    product.images?.[0] ||
                    "/placeholder.jpg"
                  }
                  alt={product.name}
                  className=" h-52 w-full object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-sans text-base font-semibold">
                      ₹
                      {product.discountPrice > 0
                        ? product.discountPrice?.toLocaleString()
                        : product.price.toLocaleString()}
                    </div>
                    {product.discountPrice > 0 && (
                      <div className="text-xs line-through font-sans text-gray-500">
                        ₹{product.price?.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="text-sm">
                    <AddToCartButton product={product} userId={user?._id} className="text-white bg-gray-900 hover:bg-gray-950 transition disabled:opacity-50" />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PopularProducts;
