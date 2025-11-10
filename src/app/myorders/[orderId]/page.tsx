"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${orderId}`);
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-blue-500"></div>
      </div>
    );

  if (!order)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-600">The order you're looking for doesn't exist.</p>
        </div>
      </div>
    );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "text-green-600";
      case "Cancelled":
        return "text-red-600";
      case "Pending":
        return "text-orange-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-4">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <span className="mx-2">/</span>
          <span className="hover:text-blue-600 cursor-pointer">My Orders</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Order Details</span>
        </div>

        {/* Delivery Status Bar */}
        <div className="bg-white shadow-sm mb-4 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className={`text-lg font-medium ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus === "Delivered" && "✓ "}
                  {order.orderStatus}
                </h1>
                {order.deliveryDate && (
                  <span className="text-gray-600">
                    {order.orderStatus === "Delivered" ? "on" : "by"}{" "}
                    {new Date(order.deliveryDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Your item has been {order.orderStatus.toLowerCase()}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-between relative mt-6">
            <div className="absolute top-2 left-0 right-0 h-0.5 bg-gray-200">
              <div
                className={`h-full ${
                  order.orderStatus === "Delivered"
                    ? "bg-green-600 w-full"
                    : order.orderStatus === "Cancelled"
                    ? "bg-red-600 w-1/4"
                    : "bg-blue-600 w-1/2"
                }`}
              ></div>
            </div>
            <div className="flex justify-between w-full relative">
              <div className="flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-green-600 border-4 border-white"></div>
                <span className="text-xs text-gray-600 mt-2">Order Placed</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-5 h-5 rounded-full ${
                    order.orderStatus !== "Cancelled" ? "bg-green-600" : "bg-gray-300"
                  } border-4 border-white`}
                ></div>
                <span className="text-xs text-gray-600 mt-2">Shipped</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-5 h-5 rounded-full ${
                    order.orderStatus === "Delivered" ? "bg-green-600" : "bg-gray-300"
                  } border-4 border-white`}
                ></div>
                <span className="text-xs text-gray-600 mt-2">Delivered</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Items & Address */}
          <div className="lg:col-span-2 space-y-4">
            {/* Order Items */}
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="bg-white shadow-sm p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-100 flex-shrink-0 overflow-hidden border">
                    {item.productImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <span className="text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-normal text-gray-900 mb-1">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">Qty: {item.quantity}</p>
                    <p className="text-base font-medium text-gray-900">
                      ₹{(item.priceAtPurchase * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Delivery Address */}
            {order.shippingAddress && (
              <div className="bg-white shadow-sm p-6">
                <h2 className="text-base font-medium text-gray-900 mb-4 pb-3 border-b">
                  Delivery Address
                </h2>
                <div className="text-sm space-y-1">
                  <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                  <p className="text-gray-700">{order.shippingAddress.address}</p>
                  {order.shippingAddress.landMark && (
                    <p className="text-gray-700">{order.shippingAddress.landMark}</p>
                  )}
                  <p className="text-gray-700">
                    {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                    {order.shippingAddress.pinCode}
                  </p>
                  <p className="text-gray-700">{order.shippingAddress.country}</p>
                  <p className="font-medium text-gray-900 mt-3">
                    Phone number: {order.shippingAddress.mobileNumber}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Details */}
          <div className="space-y-4">
            {/* Price Details */}
            <div className="bg-white shadow-sm p-6">
              <h2 className="text-base font-medium text-gray-900 mb-4 pb-3 border-b">
                Price Details
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">
                    Price ({order.items.length} {order.items.length === 1 ? "item" : "items"})
                  </span>
                  <span className="text-gray-900">₹{order.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Delivery Charges</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-base">
                  <span className="text-gray-900">Total Amount</span>
                  <span className="text-gray-900">₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white shadow-sm p-6">
              <h2 className="text-base font-medium text-gray-900 mb-4 pb-3 border-b">
                Order Details
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Order ID</p>
                  <p className="text-gray-900 font-medium">{order._id}</p>
                </div>
                <div>
                  <p className="text-gray-600">Payment</p>
                  <p className="text-gray-900">{order.paymentMethod}</p>
                  <p className="text-xs text-gray-500 mt-1">Status: {order.paymentStatus}</p>
                </div>
                {order.transactionId && (
                  <div>
                    <p className="text-gray-600">Transaction ID</p>
                    <p className="text-gray-900 font-mono text-xs break-all">
                      {order.transactionId}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600">Order Date</p>
                  <p className="text-gray-900">
                    {new Date(order.orderDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}