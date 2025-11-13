"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import Quill to prevent SSR errors
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function BlogAdminPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Admin");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const quillRef = useRef<any>(null);

  // ✅ Quill modules configuration
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
      ],
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "link",
    "image",
  ];

  // ✅ Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Please fill in all required fields!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("shortDescription", shortDescription);
    formData.append("content", content);
    formData.append("author", author);
    if (image) formData.append("file", image);

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Blog Created Successfully!");
        setTitle("");
        setSlug("");
        setShortDescription("");
        setContent("");
        setImage(null);
        setPreviewUrl("");
      } else {
        alert("❌ Failed to create blog!");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("❌ Something went wrong!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold mb-6">📝 Create New Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Title</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
            }}
            required
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Short Description
          </label>
          <textarea
            className="border p-2 w-full rounded min-h-[100px]"
            placeholder="Enter a short summary of the blog..."
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImage(file);
                setPreviewUrl(URL.createObjectURL(file));
              }
            }}
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-48 h-32 object-cover mt-3 rounded-lg shadow-md border"
            />
          )}
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Blog Content
          </label>
          <ReactQuill
            // ref={quillRef}
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            className="min-h-[300px] bg-white rounded-lg border"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Publish Blog
        </button>
      </form>
    </div>
  );
}
