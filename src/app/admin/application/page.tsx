"use client";

import { Edit, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ApplicationType {
  _id: string;
  title: string;
  description: string;
  image: string;
}

export default function ApplicationList() {
  const [applications, setApplications] = useState<ApplicationType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const res = await fetch("/api/application");
    const data = await res.json();

    if (data.success) {
      setApplications(data.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return;

    const res = await fetch(`/api/application/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      setApplications((prev) => prev.filter((item) => item._id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">All Applications</h2>

        <Link
          href="/admin/application/upload"
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md transition shadow"
        >
          <Plus size={18} /> Upload Application
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {applications.length === 0 ? (
          <p className="col-span-full items-center justify-center text-center text-gray-600">
            No applications found.
          </p>
        ) : (
          applications.map((app) => (
            <div
              key={app._id}
              className="border rounded-lg shadow p-2 bg-white"
            >
              <img
                src={app.image}
                alt={app.title}
                className="w-full h-40 object-cover rounded"
              />

              <h3 className="mt-3 text-xl font-semibold text-gray-900">
                {app.title}
              </h3>

              <p className="mt-2 text-gray-700 line-clamp-2 text-sm">{app.description}</p>

              <div className="flex justify-end gap-2 mt-3">
                <Link
                  href={`/admin/application/update/${app._id}`}
                  className="p-2 rounded-md bg-green-100 hover:bg-green-200 transition"
                  title="Edit"
                >
                  <Edit size={16} className="text-green-700" />
                </Link>

                <button
                  onClick={() => handleDelete(app._id)}
                  className="p-2 rounded-md bg-red-100 hover:bg-red-200 transition"
                  title="Delete"
                >
                  <Trash2 size={16} className="text-red-700" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
