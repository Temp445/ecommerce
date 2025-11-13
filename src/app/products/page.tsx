import { Suspense } from "react";
import ProductsClient from './ProductsClient'
export const dynamic = "force-dynamic";

const ProductPage = () => {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading products...</div>}>
        <ProductsClient />
    </Suspense>
  )
}

export default ProductPage