'use client'

import React from "react";
import Image from "next/image";
import hydraulic from "@/assets/images/product1.png"
import hydraulic2 from "@/assets/Usage/truck.jpg"

const categories = [
  {
    name: "Hydraulic Cylinders",
    image: hydraulic,
    link: "/products/cylinders",
    applications: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab iste praesentium libero ipsum beatae corrupti sequi. Corrupti nisi pariatur ratione ex exercitationem deleniti enim earum commodi! Voluptatem facilis iste quae?",
  },
  {
    name: "Hydraulic Pumps",
    image: hydraulic,
    link: "/products/pumps",
    applications: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab iste praesentium libero ipsum beatae corrupti sequi. Corrupti nisi pariatur ratione ex exercitationem deleniti enim earum commodi! Voluptatem facilis iste quae?",
  },
  {
    name: "Hydraulic Valves",
    image: hydraulic,
    link: "/products/valves",
    applications: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab iste praesentium libero ipsum beatae corrupti sequi. Corrupti nisi pariatur ratione ex exercitationem deleniti enim earum commodi! Voluptatem facilis iste quae?",
  },
  {
    name: "Accessories",
    image: hydraulic,
    link: "/products/accessories",
    applications: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab iste praesentium libero ipsum beatae corrupti sequi. Corrupti nisi pariatur ratione ex exercitationem deleniti enim earum commodi! Voluptatem facilis iste quae?",
  }
];

export default function BlogSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="inline-block px-4 py-2 bg-gray-300 text-gray-900 text-xs font-bold uppercase tracking-wider mb-4">
                Blogs
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Hydraulic<br/> Cyclinders
              </h2>
          
              <div className="w-16 h-1 bg-gray-800"></div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            {categories.map((cat, idx) => (
              <a
                href={cat.link}
                key={idx}
                className="group flex flex-col md:flex-row bg-white hover:bg-gray-50 transition-all duration-300 border-l-4 border-gray-300 hover:border-gray-900 shadow-sm hover:shadow-lg"
              >
                <div className="w-[300px] flex items-center justify-center p-4 relative overflow-hidden">
           
                  <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full"
                    />
                  </div>
                </div>

                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                     
                          <span className="text-2xl flex items-end font-bold text-gray-400">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2  transition-colors duration-300">
                          {cat.name}
                        </h3>
                      </div>
                    </div>

                    <div className="mb-4">
                     
                      <p className="text-sm text-gray-700">
                        {cat.applications}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end justify-end pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 group-hover:gap-3 transition-all duration-300">
                      <span>Explore</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}