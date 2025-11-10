// app/api/saved/[userId]/route.ts
import dbConnect from "@/lib/dbConnect";
import SavedForLater from "@/models/SavedForLater";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  await dbConnect();
  const { userId } = params;

  if (!userId) return NextResponse.json({ message: "UserId is required" }, { status: 400 });

  try {
    let saved = await SavedForLater.findOne({ userId }).populate("items.productId");
    if (!saved) saved = await SavedForLater.create({ userId, items: [] });
    return NextResponse.json({ saved }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  await dbConnect();
  const { userId } = params;
  const body = await req.json();
  const { productId, quantity = 1 } = body;

  if (!userId || !productId) {
    return NextResponse.json({ message: "UserId and ProductId are required" }, { status: 400 });
  }

  try {
    let saved = await SavedForLater.findOne({ userId });
    if (!saved) saved = await SavedForLater.create({ userId, items: [] });

    const index = saved.items.findIndex((i: { productId: { toString: () => any; }; }) => i.productId.toString() === productId);
    if (index > -1) {
      saved.items[index].quantity += quantity;
    } else {
      saved.items.push({ productId, quantity });
    }

    await saved.save();
    await saved.populate("items.productId");
    return NextResponse.json({ saved }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  await dbConnect();
  const { userId } = params;
  const body = await req.json();
  const { productId, quantity } = body;

  if (!userId || !productId || quantity === undefined) {
    return NextResponse.json({ message: "UserId, ProductId, and quantity are required" }, { status: 400 });
  }

  try {
    const saved = await SavedForLater.findOne({ userId });
    if (!saved) return NextResponse.json({ message: "Saved list not found" }, { status: 404 });

    const index = saved.items.findIndex((i: { productId: { toString: () => any; }; }) => i.productId.toString() === productId);
    if (index === -1) return NextResponse.json({ message: "Item not found" }, { status: 404 });

    saved.items[index].quantity = quantity;
    await saved.save();
    await saved.populate("items.productId");

    return NextResponse.json({ saved }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  await dbConnect();
  const { userId } = params;
  const body = await req.json();
  const { productId } = body;

  if (!userId || !productId) {
    return NextResponse.json({ message: "UserId and ProductId are required" }, { status: 400 });
  }

  try {
    const saved = await SavedForLater.findOne({ userId });
    if (!saved) return NextResponse.json({ message: "Saved list not found" }, { status: 404 });

    saved.items = saved.items.filter((i: { productId: { toString: () => any; }; }) => i.productId.toString() !== productId);
    await saved.save();
    await saved.populate("items.productId");

    return NextResponse.json({ saved }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
