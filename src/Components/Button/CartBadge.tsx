"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartProvider";

export default function Navbar() {
  const { cartCount } = useCart();

  return (
    <div className="flex items-center justify-center  py-4">

      <Link href="/cart" className="relative flex items-center gap-1">
        <ShoppingCart className="w-5 2xl:w-6 2xl:h-6 text-gray-900" />
        {cartCount > 0 && (
            <span className="absolute -top-2 left-3 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"> {cartCount}</span>

        )}
      <div className="text-sm 2xl:text-base">Cart</div>
      </Link>

    </div>
  );
}
