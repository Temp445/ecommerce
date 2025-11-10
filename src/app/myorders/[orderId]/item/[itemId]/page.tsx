"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function SingleOrderItemPage() {
  const { itemId, orderId } = useParams();
  const router = useRouter();

  const [itemData, setItemData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!orderId || !itemId) return;
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${orderId}/items/${itemId}`);
        setItemData(data);
      } catch (error) {
        console.error("Error fetching item:", error);
        toast.error("Failed to load order item details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orderId, itemId]);

  const handleStatusUpdate = async (status: string) => {
    try {
      setUpdating(true);
      await axios.patch(`/api/orders/${orderId}/items/${itemId}`, {
        orderStatus: status,
      });
      toast.success(`Item ${status} successfully`);
      router.refresh();
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (!itemData)
    return (
      <div className="text-center mt-20 text-gray-600">
        ❌ No item found for this order.
      </div>
    );

  const { item, shippingAddress, paymentMethod, paymentStatus, orderId: oid } = itemData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">Order Item Details</h1>

        {/* Product Info */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="w-full sm:w-1/3 h-40 bg-gray-100 flex items-center justify-center rounded">
            {item.productImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.productImage}
                alt={item.productName}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <span className="text-gray-400 text-sm">No Image</span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-medium text-gray-900">{item.productName}</h2>
            <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
            <p className="text-gray-800 font-semibold mt-2">
              ₹{item.priceAtPurchase.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">Product ID: {item.productId}</p>
            <p className="text-sm text-gray-500 mt-1">Item ID: {item._id}</p>
          </div>
        </div>

        {/* Order Info */}
        <div className="border-t pt-4 text-sm text-gray-700 space-y-1">
          <p><strong>Order ID:</strong> {oid}</p>
          <p><strong>Payment Method:</strong> {paymentMethod}</p>
          <p><strong>Payment Status:</strong> {paymentStatus}</p>
          <p><strong>Order Status:</strong> {item.orderStatus}</p>
        </div>

        {/* Shipping Info */}
        {shippingAddress && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p>{shippingAddress.name}</p>
              <p>{shippingAddress.address}</p>
              <p>
                {shippingAddress.city}, {shippingAddress.state} -{" "}
                {shippingAddress.pinCode}
              </p>
              <p>{shippingAddress.country}</p>
              <p>📞 {shippingAddress.mobileNumber}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            disabled={updating}
            onClick={() => handleStatusUpdate("Delivered")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Mark as Delivered
          </button>

          <button
            disabled={updating}
            onClick={() => handleStatusUpdate("Cancelled")}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Cancel Product
          </button>

          <button
            disabled={updating}
            onClick={() => handleStatusUpdate("Return Requested")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Mark as Return Requested
          </button>
        </div>

        {updating && (
          <p className="text-sm text-blue-600 mt-3 animate-pulse">
            Updating status...
          </p>
        )}
      </div>
    </div>
  );
}
