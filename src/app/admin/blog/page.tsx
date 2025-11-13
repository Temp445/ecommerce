"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  imageUrl?: string;
  slug: string;
  createdAt: string;
}

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        setBlogs(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // ✅ Delete blog
  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      const res = await fetch(`/api/blog/${slug}`, { method: "DELETE" });
      if (res.ok) {
        alert("🗑️ Blog deleted!");
        setBlogs((prev) => prev.filter((b) => b.slug !== slug));
      } else {
        alert("❌ Failed to delete blog!");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) return <p className="text-center py-10 text-gray-600">Loading blogs...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold"> Blog Management</h1>
        <button
          onClick={() => router.push("/admin/blog/upload")}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md  transition"
        >
          <Plus size={18} /> New Blog
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white border rounded-lg shadow-md hover:shadow-lg transition relative group overflow-hidden"
            >
              {blog.imageUrl ? (
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              <div className="p-4">
                <h2 className="text-lg font-semibold mb-1 line-clamp-1">
                  {blog.title}
                </h2>
              
              </div>

              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => router.push(`/admin/blog/update/${blog.slug}`)}
                  className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600"
                  title="Edit Blog"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(blog.slug)}
                  className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                  title="Delete Blog"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No blogs found. Create one!
          </p>
        )}
      </div>
    </div>
  );
}
