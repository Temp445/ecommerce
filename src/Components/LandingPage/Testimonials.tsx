"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Rohit Sharma",
      company: "ABC Industries",
      review:
        "Their hydraulic cylinders are top-notch. Exceptional durability and performance for our heavy-duty equipment!",
      rating: 5,
      role: "Operations Manager"
    },
    {
      name: "Priya Verma",
      company: "AutoLift Solutions",
      review:
        "Excellent service and custom solutions. Delivery was on time, and the team was very responsive.",
      rating: 4,
      role: "Procurement Head"
    },
    {
      name: "Suresh Kumar",
      company: "MachTech Pvt Ltd",
      review:
        "High precision and long-lasting products. Definitely our go-to supplier for all hydraulic components.",
      rating: 5,
      role: "Technical Director"
    },
  ];

  

  return (
    <section className="relative px-6 max-w-7xl mx-auto py-10 overflow-hidden">
   
      
      {/* Header */}
      <motion.div
        className="text-center mb-16"
      >
        <span className="text- font-semibold text-sm uppercase tracking-wider mb-2 block">
          Testimonials
        </span>
        <h2 className="text-4xl font-semibold mb-4 text-gray-900">
          What Our Clients Say
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Trusted by industry leaders for precision hydraulic solutions
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            className="relative bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 group"
          >
      

            <div className="flex gap-1 mb-4 mt-4">
              <Quote className="text-gray-500 w-6 h-6" fill="currentColor" />
        
            </div>

            {/* Review */}
            <p className="text-gray-700 leading-relaxed mb-6 text-base">
              "{t.review}"
            </p>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {t.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{t.name}</h4>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}