"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/AceLogo.png";
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin, } from "lucide-react";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Footer() {
    const [categories, setCategories] = useState<any[]>([]);
      const router = useRouter();
    
      const fetchCategories = async () => {
        try {
          const res = await axios.get("/api/category");
          setCategories(res.data.data || []);
        } catch (err: any) {
          console.error(err.response?.data?.message || "Failed to load categories");
        } finally {
        }
      };
    
      useEffect(() => {
        fetchCategories();
      }, []);
  return (
    <footer className="bg-gradient-to-b from-gray-950 to-black text-gray-300">
      

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={Logo}
                alt="ACE Hydraulic logo"
                width={40}
                height={40}
                className="w-10 h-10 p-1 flex-shrink-0 bg-white  rounded-full"
              />
              <h2 className="text-xl font-medium text-white">ACE HYDRAULIC</h2>
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">Advanced hydraulic cylinder solutions engineered for maximum industrial performance and reliability.</p>
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook" className="p-2.5 bg-gray-800 rounded-lg hover:bg-blue-600 transition duration-300 transform hover:scale-110">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="p-2.5 bg-gray-800 rounded-lg hover:bg-blue-400 transition duration-300 transform hover:scale-110">
                <Twitter size={18} />
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2.5 bg-gray-800 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-110">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-medium mb-5 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-white rounded"></span>
              Navigation
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-white hover:translate-x-1 transition duration-300 inline-flex items-center">Home</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white hover:translate-x-1 transition duration-300 inline-flex items-center">About Us</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-white hover:translate-x-1 transition duration-300 inline-flex items-center">Products</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white hover:translate-x-1 transition duration-300 inline-flex items-center">Blog</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white hover:translate-x-1 transition duration-300 inline-flex items-center">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-5 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-white rounded"></span>
              Category
            </h3>
            {categories.slice(0, 4).map((cat) => (

            <ul key={cat._id} className="space-y-3 text-sm">
              <li><Link href={`/products?category=${cat._id}`} className="text-gray-400 py-2 hover:text-white hover:translate-x-1 transition duration-300 inline-flex items-center">{cat.Name}</Link></li>
            </ul>
            ))}
          </div>

          <div>
            <h3 className="text-white font-medium mb-5 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-white rounded"></span>
              Contact
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3 group">
                <MapPin size={18} className="flex-shrink-0" />
                <span className="text-gray-400 group-hover:text-gray-300 transition">#306, 2nd Floor, NSIC-Software Technology Business Park, B-24, Guindy Industrial Estate, Ekkatuthangal, Chennai-600032, India</span>
              </li>
              <li className="flex gap-3 group">
                <Phone size={18} className="flex-shrink-0" />
                <a href="tel:+919876543210" className="text-gray-400 group-hover:text-white transition">+91 9876543210</a>
              </li>
              <li className="flex gap-3 group">
                <Mail size={18} className="flex-shrink-0" />
                <a href="mailto:info@acehydraulic.com" className="text-gray-400 group-hover:text-white transition break-all">info@acehydraulic.com</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mb-12">
          <h3 className="text-white font-medium mb-4 text-lg flex items-center gap-2">
            <span className="w-1 h-6 bg-white rounded"></span>
            Find Us
          </h3>
          <div className="rounded-xl overflow-hidden h-64 shadow-2xl border border-gray-800 hover:border-blue-500 transition duration-300">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d31098.12104086999!2d80.206727!3d13.018781!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52669470c1b127%3A0xe3512b101f4ee3ad!2sACE%20Software%20Solutions%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1763098771577!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }}
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div className="border-gray-800 pt-8">
          

          <div className="text-center text-xs text-gray-600 border-t border-gray-800 pt-6">
            <p>© 2025 ACE HYDRAULIC. All rights reserved. | Engineered for Power </p>
          </div>
        </div>
      </div>
    </footer>
  );
}