"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminOrderItemDetailPage() {
  const { orderId, itemId } = useParams();
  const [orderItem, setOrderItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId && itemId) fetchItemDetail();
  }, [orderId, itemId]);

  const fetchItemDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/orders/${orderId}/items/${itemId}`);
      setOrderItem(res.data.item);
    } catch (error) {
      console.error("Error fetching item details:", error);
      toast.error("Failed to load item details");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Clock className="animate-spin text-blue-600" size={32} />
        <p className="ml-3 text-gray-600">Loading item details...</p>
      </div>
    );

  if (!orderItem)
    return (
      <div className="text-center py-10">
        <XCircle className="mx-auto text-red-500 mb-3" size={40} />
        <p className="text-gray-600">Item not found</p>
        <Link href={`/admin/orders/${orderId}`} className="text-blue-600 hover:underline mt-2 inline-block">
          ← Back to Order
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        {/* Back Button */}
        <Link href={`/admin/orders/${orderId}`} className="inline-flex items-center text-blue-600 hover:underline mb-4">
          <ArrowLeft size={18} className="mr-2" /> Back to Order
        </Link>

        {/* Header */}
        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Product Detail</h1>
          <span className="text-sm font-semibold text-gray-700">
            Status: {orderItem.orderStatus}
          </span>
        </div>

        {/* Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {orderItem.productImage ? (
              <img
                src={orderItem.productImage}
                alt={orderItem.productName}
                className="rounded-lg border w-full max-h-80 object-contain"
              />
            ) : (
              <div className="bg-gray-100 border rounded-lg h-80 flex items-center justify-center text-gray-500">
                No Image Available
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">{orderItem.productName}</h2>
            <p className="text-gray-700">
              <strong>Product ID:</strong> {orderItem.productId}
            </p>
            <p className="text-gray-700">
              <strong>Quantity:</strong> {orderItem.quantity}
            </p>
            <p className="text-gray-700">
              <strong>Price at Purchase:</strong> ₹{orderItem.priceAtPurchase}
            </p>

            <div className="flex items-center gap-2 text-gray-700">
              {orderItem.orderStatus === "Delivered" && <CheckCircle className="text-green-600" size={20} />}
              {orderItem.orderStatus === "Shipped" && <Truck className="text-blue-600" size={20} />}
              {orderItem.orderStatus === "Processing" && <Clock className="text-amber-600" size={20} />}
              {orderItem.orderStatus === "Cancelled" && <XCircle className="text-red-600" size={20} />}
              <span className="font-medium">{orderItem.orderStatus}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t mt-6 pt-4 text-right">
          <p className="text-lg font-bold text-gray-900">
            Total: ₹{orderItem.quantity * orderItem.priceAtPurchase}
          </p>
        </div>
      </div>
    </div>
  );
}
