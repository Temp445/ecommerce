"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Search, AlertCircle } from "lucide-react";
import { Package, Truck, ClockFading } from "lucide-react";

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

  const stats = {
    total: orders.reduce((acc, order) => acc + order.items.length, 0),
    processing: orders.reduce(
      (acc, order) =>
        acc +
        order.items.filter((item: any) => item.orderStatus === "Processing")
          .length,
      0
    ),
    shipped: orders.reduce(
      (acc, order) =>
        acc +
        order.items.filter((item: any) => item.orderStatus === "Shipped")
          .length,
      0
    ),
    delivered: orders.reduce(
      (acc, order) =>
        acc +
        order.items.filter((item: any) => item.orderStatus === "Delivered")
          .length,
      0
    ),
    cancelled: orders.reduce(
      (acc, order) =>
        acc +
        order.items.filter((item: any) => item.orderStatus === "Cancelled")
          .length,
      0
    ),
  };

  if (!loading && filteredOrders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <AlertCircle className="mx-auto mb-3 text-gray-400" size={40} />
        <p className="text-gray-600 font-medium">No orders found</p>
        <p className="text-gray-500 text-sm mt-1">
          Try adjusting your search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6 px-2 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <h1 className="text-2xl font-medium text-gray-900">Orders</h1>
              <p className="text-gray-600 text-sm">
                Manage and track customer orders
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className=" rounded p-4 border ">
            <div className="flex items-center justify-between">
              <div>
                <p className=" text-sm font-medium">Total Orders</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <Package className="w-10 h-10" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">
                  Processing
                </p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">
                  {stats.processing}
                </p>
              </div>
              <ClockFading className="w-10 h-10 text-yellow-600 opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Shipped</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {stats.shipped}
                </p>
              </div>
              <Truck className="w-10 h-10 text-blue-600 opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Delivered</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {stats.delivered}
                </p>
              </div>
              <Package className="w-10 h-10 text-green-600 opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-700 text-sm font-medium">Cancelled</p>
                <p className="text-2xl font-bold text-red-900 mt-1">
                  {stats.cancelled}
                </p>
              </div>
              <Package className="w-10 h-10 text-red-600 opacity-80" />
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
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg  outline-none bg-white shadow-sm transition"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border gap-5 border-gray-200 overflow-hidden hover:shadow-md transition"
              >
                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white space-y-5">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
                      <div className="flex gap-4 mt-3 text-sm text-gray-600">
                        <div className="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="h-4 bg-gray-200 rounded w-1/6 mb-2 animate-pulse"></div>
                      <div className="flex flex-col gap-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="h-5 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
                  <div className="space-y-3">
                    <div className="rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div className="flex-1">
                          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                          <div className="flex gap-4 mt-2 text-sm text-gray-600">
                            <div className="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg border overflow-hidden border-gray-500 py-5 transition"
              >
                <div className=" px-3 md:px-5">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Order ID
                      </p>
                      <p className="font-mono text-sm md:text-lg font-bold text-blue-600">
                        {order._id}
                      </p>
                      <div className="flex flex-col lg:flex-row mb-1  gap-2 mt-3 text-sm text-gray-900">
                        <span>
                          Customer Name :{" "}
                        <strong> {order.shippingAddress?.Name}</strong>
                        </span>{" "}
                        <span>
                          Contact No :{" "}
                        <strong> {order.shippingAddress?.MobileNumber}</strong>
                        </span>{" "}
                        <span className="font-sans">
                           Total Price: {" "}
                         <strong> ₹ {order.totalAmount.toLocaleString()} </strong>
                        </span>
                      </div>
                      
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-gray-800 mb-2">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>
                      <div className="flex flex-col gap-1">
                        <p>
                          <span className="text-gray-600">Payment:</span>{" "}
                          <span className="font-semibold">
                            {order.paymentMethod}
                          </span>
                        </p>
                        <span>{order.paymentStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>
                   <div className="px-3 md:px-5 border-b md:border-dashed pb-4 border-gray-500">
                    <span className="font-sans text-gray-900 text-sm">
                        Address:{" "}
                        {order.shippingAddress?.Address}
                      </span>
                   </div>

                <div className="md:pt-5">
                  <p className="font-medium text-gray-900 p-2 md:px-5 flex items-center ">
                    Order Items ({order.items.length})
                  </p>
                  <div className="space-y-3">
                    {order.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className={`border-t  border-gray-500  p-3 md:p-5 transition `}
                      >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {item.productName}
                            </p>
                            <div className="flex md:flex-col  gap-4 mt-2 text-sm text-gray-600">
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
                              <span className="font-sans">
                                {" "}
                                Delivery Charge :{" "}
                                {item.deliveryCharge > 0 ? (
                                  <span> ₹{item.deliveryCharge} </span>
                                ) : (
                                  "Free"
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center">
                            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                              <div>
                                <label className="block text-xs text-end font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                  Order Status
                                </label>

                                {item.orderStatus === "Cancelled" ? (
                                  <div className="flex flex-col items-end md:gap-4 space-y-2 md:space-y-0">
                                    <p
                                      className={`flex-shrink-0 px-3 py-1.5 border w-fit rounded-lg text-sm font-medium text-center ${getStatusColor(
                                        item.orderStatus
                                      )}`}
                                    >
                                      Cancelled
                                    </p>
                                    {item.cancelReason && (
                                      <p className="text-xs md:text-sm text-gray-600 break-words text-end">
                                        <span className="font-medium">
                                          Cancel At: {new Date(item.cancelledAt).toLocaleDateString("en-IN")}
                                        </span>
                                      </p>
                                    )}
                                    {item.cancelReason && (
                                      <p className="text-xs md:text-sm text-gray-600 break-words text-end">
                                        <span className="font-medium">
                                          Cancel Reason:
                                        </span>{" "}
                                        <br /> {item.cancelReason}
                                      </p>
                                    )}
                                  </div>
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
                                    <option value="Processing">
                                      Processing
                                    </option>
                                    <option value="Packed">Packed</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Out for Delivery">
                                      Out for Delivery
                                    </option>
                                    <option value="Delivered">Delivered</option>
                                    {/* <option value="Returned">Returned</option> */}
                                    {/* <option value="Refunded">Refunded</option> */}
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
