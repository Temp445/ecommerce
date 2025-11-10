"use client";

import { useState } from "react";

export default function ApplicationUploadForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      const res = await fetch("/api/application", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Application uploaded successfully!");
        setTitle("");
        setDescription("");
        setImage(null);
        setPreview(null);
      } else {
        setMessage(data.message || "Failed to upload");
      }
    } catch (error) {
      setMessage("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow p-6 rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        Add New Application
      </h2>

      {message && (
        <p className="mb-4 text-center font-medium text-blue-700">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div>
          <label className="block font-medium mb-1 text-gray-800">
            Title
          </label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1 text-gray-800">
            Description
          </label>
          <textarea
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            rows={4}
            required
          ></textarea>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-2 text-gray-800">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full border p-2 rounded"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImage(file);
              setPreview(file ? URL.createObjectURL(file) : null);
            }}
            required
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="mt-3">
            <img
              src={preview}
              alt="Preview"
              className="w-40 rounded border"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded"
        >
          {loading ? "Uploading..." : "Upload Application"}
        </button>
      </form>
    </div>
  );
}
