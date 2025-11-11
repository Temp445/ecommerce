import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function PATCH(
  req: Request,
  { params }: { params:  Promise <{ orderId: string; itemId: string }> }
) {
  try {
    await dbConnect();

    const { orderId, itemId } = await params;
    const body = await req.json();
    const { reason } = body;

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const item = order.items.id(itemId);
    if (!item) {
      return NextResponse.json({ message: "Item not found in this order" }, { status: 404 });
    }

    if (["Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned"].includes(item.orderStatus)) {
      return NextResponse.json({ message: "Item cannot be cancelled because it is already shipped or out for delivery." }, { status: 400 });
    }

    item.orderStatus = "Cancelled";
    item.cancelReason = reason || "Cancelled by user";
    item.cancelledAt = new Date();

    const allCancelled = order.items.every(
      (itm: { _id: string; orderStatus: string; }) => itm._id === itemId || itm.orderStatus === "Cancelled"
    );
    if (allCancelled) {
      order.overallStatus = "Cancelled";
    }

    await order.save();

    return NextResponse.json({
      message: "Item cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Error cancelling item:", error);
    return NextResponse.json({ message: "Error cancelling item" }, { status: 500 });
  }
}
