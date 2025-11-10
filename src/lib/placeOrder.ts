import mongoose from "mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";

interface OrderItem {
  deliveryCharge: number;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
}

interface OrderData {
  userId: string;
  items: OrderItem[];
  shippingAddress: {
  Name: string;
  MobileNumber: string;
  PinCode: number;
  Address: string;
  City: string;
  LandMark?: string;
  State?: string;
  Country?: string;
  }
  totalAmount: number;
  paymentMethod?: string;
  paymentStatus?: string;
  orderStatus?: string;
}

export async function placeOrder(data: OrderData) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const validatedItems: any[] = [];

    for (const item of data.items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) continue; 
      if (item.quantity > product.stock) continue; 

      product.stock -= item.quantity;
      await product.save({ session });

      validatedItems.push({
        productId: product._id,
        productName: product.name,
        productImage: product.thumbnail || "",
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
      });
    }

    if (validatedItems.length === 0) {
      await session.abortTransaction();
      session.endSession();
      throw new Error("No items available in stock to place the order.");
    }

    const order = await Order.create(
      [
        {
          userId: data.userId,
          items: validatedItems,
          shippingAddress: data.shippingAddress,
          totalAmount: data.totalAmount,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentStatus,
          status: data.orderStatus || "Pending",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return order[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}
