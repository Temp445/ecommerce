"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Search, AlertCircle } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/orders");
      if (res.data.orders) {
        setOrders(res.data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleItemUpdate = async (
    orderId: string,
    itemId: string,
    data: any
  ) => {
    try {
      setUpdatingId(itemId);
      await axios.patch(`/api/orders/${orderId}/items/${itemId}`, data);
      toast.success("Item updated successfully");
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update item");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Processing: "bg-amber-50 border-amber-200 text-amber-800",
      Packed: "bg-sky-100 border-sky-200 text-sky-800",
      Shipped: "bg-blue-50 border-blue-200 text-blue-800",
      "Out for Delivery": "bg-green-50 border-green-200 text-green-800",
      Delivered: "bg-green-50 border-green-200 text-green-800",
      Cancelled: "bg-red-50 border-red-200 text-red-800",
      Returned: "bg-violet-50 border-violet-200 text-violet-800",
      Refunded: "bg-orange-50 border-orange-200 text-orange-800",
    };
    return colors[status] || "bg-gray-50 border-gray-200 text-gray-800";
  };

  
  const filteredOrders = orders.filter((order) => {
    const name = order?.shippingAddress?.Name || "";
    return (
      order._id?.toLowerCase().includes(search.toLowerCase()) ||
      name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Orders</h1>
              <p className="text-gray-600 text-sm">
                Manage and track customer orders
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-4 top-3.5 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by Order ID or Customer Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white shadow-sm transition"
            />
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <AlertCircle className="mx-auto mb-3 text-gray-400" size={40} />
            <p className="text-gray-600 font-medium">No orders found</p>
            <p className="text-gray-500 text-sm mt-1">
              Try adjusting your search criteria
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-500 hover:shadow-md transition"
              >
                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Order ID
                      </p>
                      <p className="font-mono text-lg font-bold text-blue-600">
                        {order._id}
                      </p>
                      <div className="flex gap-4 mt-3 text-sm text-gray-600">
                        <span>
                          <strong>Customer Name :</strong>{" "}
                          {order.shippingAddress?.Name}
                        </span> |
                        <span>
                          <strong>Contact No :</strong>{" "}
                          {order.shippingAddress?.MobileNumber}
                        </span> |
                        <span className="font-sans">
                        <strong>  Total Price:</strong>{" "}
                         ₹ {order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-gray-600 mb-2">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>
                      <div className="flex flex-col gap-1">
                        <p>
                          <span className="text-gray-600">Payment:</span>{" "}
                          <span className="font-semibold">
                            {order.paymentMethod}
                          </span>
                        </p>
                        <span>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <p className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    Order Items ({order.items.length})
                  </p>
                  <div className="space-y-3">
                    {order.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 transition ${getStatusColor(
                          item.orderStatus
                        )}`}
                      >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {item.productName}
                            </p>
                            <div className="flex gap-4 mt-2 text-sm text-gray-600">
                              <span>
                                Qty: <strong>{item.quantity}</strong>
                              </span>
                              <span className="font-sans">
                                Subtotal: ₹
                                <strong>
                                  {item.discountPriceAtPurchase > 0
                                    ? item.discountPriceAtPurchase *
                                      item.quantity
                                    : item.priceAtPurchase * item.quantity}
                                </strong>
                              </span>
                              <span className="font-sans"> Delivery Charge : { item.deliveryCharge > 0 ? <span> ₹  { item.deliveryCharge } </span> : "Free" }</span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                              <div>
                                <label className="block text-xs text-center font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                  Order Status
                                </label>

                                {item.orderStatus === "Cancelled" ? (
                                  <p
                                    className={`px-3 py-2 border rounded-lg text-sm font-medium text-center ${getStatusColor(
                                      item.orderStatus
                                    )}`}
                                  >
                                    Cancelled
                                  </p>
                                ) : (
                                  <select
                                    value={item.orderStatus}
                                    onChange={(e) =>
                                      handleItemUpdate(order._id, item._id, {
                                        orderStatus: e.target.value,
                                      })
                                    }
                                    disabled={updatingId === item._id}
                                    className={`border rounded-lg px-3 py-2 text-sm font-medium transition ${
                                      updatingId === item._id
                                        ? "opacity-50 cursor-not-allowed"
                                        : "cursor-pointer hover:border-gray-400"
                                    } ${getStatusColor(item.orderStatus)}`}
                                  >
                                    <option value="Processing">Processing</option>
                                    <option value="Packed">Packed</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Out for Delivery">Out for Delivery</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Returned">Returned</option>
                                    <option value="Refunded">Refunded</option>
                                  </select>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
