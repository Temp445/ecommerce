import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import cloudinary from "@/lib/cloudinary";

export async function GET(
  req: Request,
  { params }: { params: Promise <{ slug: string }> }
) {
    try {
  await dbConnect();
  const { slug } = await params;
  const blog = await Blog.findOne({ slug });
  if (!blog) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: blog });
    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message || "Failed to fetch blog" }, { status: 500 });
    }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise <{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await params;
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const shortDescription = formData.get("shortDescription") as string;
    const content = formData.get("content") as string;
    const author = formData.get("author") as string;
    const file = formData.get("file") as File | null;

    let imageUrl = "";
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "blogs" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      imageUrl = uploadResponse.secure_url;
    }

    const updatedBlog = await Blog.findOneAndUpdate(
      { slug },
      {
        title,
        shortDescription,
        content,
        author,
        ...(imageUrl && { imageUrl }),
      },
      { new: true }
    );

    if (!updatedBlog)
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise <{ slug: string }> }
) {
    try{
  await dbConnect();
  const { slug } = await params;
  const deleted = await Blog.findOneAndDelete({ slug });
  if (!deleted)
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, message: "Blog deleted" });
} catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to delete blog" }, { status: 500 });
  }
}
