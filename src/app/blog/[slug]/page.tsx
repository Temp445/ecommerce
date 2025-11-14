"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, ArrowLeft, Share2, Bookmark } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  imageUrl: string;
  content: string;
  createdAt: string;
}

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        const data = await res.json();
        if (data.success) {
          setBlog(data.data);
        } else {
          console.error("Blog not found");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-white" />
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <h2 className="text-6xl font-bold text-white mb-4">404</h2>
          <p className="text-gray-400 mb-8 text-lg">Article not found</p>
          <button
            onClick={() => router.push("/blog")}
            className="text-white border-2 border-white px-8 py-3 hover:bg-white hover:text-black transition-all font-bold tracking-wider"
          >
            GO BACK
          </button>
        </div>
      </div>
    );

  const readingTime = Math.ceil(blog.content.split(" ").length / 200);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
     
      <div className="relative h-screen">
        {blog.imageUrl && (
          <>
            <div className="absolute inset-0">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
            </div>
            
            <div className="absolute inset-0 flex items-end">
              <div className="max-w-5xl mx-auto px-6 pb-20 w-full">
                <div className="mb-6">
                  <span className="inline-block bg-white text-black px-6 py-2 text-xs font-bold tracking-widest uppercase">
                    Feature
                  </span>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black leading-none mb-8 tracking-tight">
                  {blog.title}
                </h1>
                
                <div className="flex items-center gap-6 text-sm text-white/80">
                  <span className="uppercase tracking-wider font-bold">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                  <span className="uppercase tracking-wider font-bold">
                    {readingTime} Min
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-white text-black py-20">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-3xl md:text-4xl font-light leading-relaxed">
            {blog.shortDescription}
          </p>
        </div>
      </div>

      <article className="bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="article-content">
          
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-20 h-1 bg-white mx-auto mb-8"></div>
              <h3 className="text-3xl font-black uppercase tracking-wider mb-4">
                Continue Reading
              </h3>
              <p className="text-white/60 text-lg">
                Explore more stories and insights
              </p>
            </div>
            
            <button
              onClick={() => router.push("/blog")}
              className="bg-white text-black px-12 py-4 text-sm font-black tracking-widest uppercase hover:bg-white/90 transition-all inline-flex items-center gap-3"
            >
              <ArrowLeft className="w-5 h-5" />
              All Articles
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogDetailPage;