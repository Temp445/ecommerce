"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface BlogData {
  title: string;
  content: string;
  author: string;
  imageUrl?: string;
}

export default function EditBlogPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [form, setForm] = useState<BlogData>({
    title: "",
    content: "",
    author: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Fetch blog details by slug
  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        const data = await res.json();
        if (data.success) {
          const blog = data.data;
          setForm({
            title: blog.title,
            content: blog.content,
            author: blog.author,
            imageUrl: blog.imageUrl,
          });
          setPreviewUrl(blog.imageUrl || "");
        }
      } catch (err) {
        console.error("Error loading blog:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  // ✅ Handle form input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit update
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("author", form.author);
    if (image) formData.append("file", image);

    try {
      const res = await fetch(`/api/blog/${slug}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        alert("✅ Blog updated successfully!");
        router.push("/admin/blog");
      } else {
        alert("❌ Update failed!");
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setSaving(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading blog...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">✏️ Edit Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <input
          type="text"
          name="title"
          className="border p-2 w-full rounded"
          placeholder="Blog Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        {/* Cover Image */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Cover Image:
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
              className="w-48 mt-3 rounded shadow-md border"
            />
          )}
        </div>

        {/* Quill Editor */}
        <ReactQuill
          theme="snow"
          value={form.content}
          onChange={(value) => setForm({ ...form, content: value })}
          modules={modules}
          className="h-[350px]"
        />

        {/* Author */}
        <input
          type="text"
          name="author"
          className="border p-2 w-full rounded"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className={`${
            saving ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          } text-white px-5 py-2 rounded transition`}
        >
          {saving ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
}
