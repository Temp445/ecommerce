"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  imageUrl?: string;
  content: string;
  author: string;
  createdAt: string;
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        const data = await res.json();
        setBlog(data);
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchBlog();
  }, [slug]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!blog) return <p className="text-center mt-10">Blog not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <div className="text-gray-500 text-sm mb-6">
        By {blog.author} •{" "}
        {new Date(blog.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </div>

      {blog.imageUrl && (
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full h-80 object-cover rounded-lg shadow mb-6"
        />
      )}

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}
