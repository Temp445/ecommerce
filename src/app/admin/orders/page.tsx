"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Package, Search, Clock, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";

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
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleItemUpdate = async (orderId: string, itemId: string, data: any) => {
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
      Shipped: "bg-blue-50 border-blue-200 text-blue-800",
      Delivered: "bg-green-50 border-green-200 text-green-800",
      Cancelled: "bg-red-50 border-red-200 text-red-800",
    };
    return colors[status] || "bg-gray-50 border-gray-200 text-gray-800";
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      Processing: "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800",
      Shipped: "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800",
      Delivered: "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800",
      Cancelled: "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800",
    };
    return badges[status] || "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800";
  };

  const stats = {
    total: orders.length,
    processing: orders.reduce((acc, o) => acc + o.items.filter((i: any) => i.orderStatus === "Processing").length, 0),
    shipped: orders.reduce((acc, o) => acc + o.items.filter((i: any) => i.orderStatus === "Shipped").length, 0),
    delivered: orders.reduce((acc, o) => acc + o.items.filter((i: any) => i.orderStatus === "Delivered").length, 0),
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh] bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Clock className="animate-spin mx-auto mb-3 text-blue-600" size={32} />
          <p className="text-gray-600 font-medium">Loading orders...</p>
        </div>
      </div>
    );

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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <Package className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Orders</h1>
              <p className="text-gray-600 text-sm">Manage and track customer orders</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Orders", value: stats.total, color: "from-blue-500 to-blue-600" },
            { label: "Processing", value: stats.processing, color: "from-amber-500 to-amber-600" },
            { label: "Shipped", value: stats.shipped, color: "from-purple-500 to-purple-600" },
            { label: "Delivered", value: stats.delivered, color: "from-green-500 to-green-600" },
          ].map((stat, i) => (
            <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-lg p-5 text-white shadow-md hover:shadow-lg transition`}>
              <p className="text-sm opacity-90 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by Order ID or Customer Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white shadow-sm transition"
            />
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <AlertCircle className="mx-auto mb-3 text-gray-400" size={40} />
            <p className="text-gray-600 font-medium">No orders found</p>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition"
              >
                {/* Order Header */}
                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order ID</p>
                      <p className="font-mono text-lg font-bold text-blue-600">{order._id}</p>
                      <div className="flex gap-4 mt-3 text-sm text-gray-600">
                        <span><strong>Customer:</strong> {order.shippingAddress?.Name}</span>
                        <span><strong>₹</strong>{order.totalAmount}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-gray-600 mb-2">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                      <div className="flex flex-col gap-1">
                        <p><span className="text-gray-600">Payment:</span> <span className="font-semibold">{order.paymentMethod}</span></p>
                        <span className={getStatusBadge(order.paymentStatus)}>{order.paymentStatus}</span>
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
                      <Link
                        href={`/admin/orders/${order._id}/items/${item._id}`}
                        key={index}

                        className={`border rounded-lg p-4 transition ${getStatusColor(item.orderStatus)}`}
                      >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{item.productName}</p>
                            <div className="flex gap-4 mt-2 text-sm text-gray-600">
                              <span>Qty: <strong>{item.quantity}</strong></span>
                              <span>₹<strong>{item.priceAtPurchase}</strong></span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                Status
                              </label>
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
                                    : "cursor-pointer hover:border-blue-400"
                                } ${getStatusColor(item.orderStatus)}`}
                              >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </Link>
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