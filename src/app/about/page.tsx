"use client";

import React from "react";
import { Wrench, ShieldCheck, Truck, Award, Factory, CheckCircle, Users, Target, Eye, PackageCheck, IndianRupee } from "lucide-react";
import VisionMissionSection from "@/Components/AboutPage/VisionMissionSection";
import HeroSection from "@/Components/AboutPage/HeroSection";
import ManufacturingProcessSection from "@/Components/AboutPage/ManufacturingProcessSection";
import WhyChooseUsSection from "@/Components/AboutPage/WhyChooseUsSection";
import WhyShopWithUs from "@/Components/AboutPage/whyShopWithUs";

const AboutPage = () => {
  return (
    <div className="bg-white text-gray-900">
     

      <HeroSection/>
      <WhyChooseUsSection/>



      {/* <section className="max-w-7xl mx-auto py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl mb-6 text-gray-900">About Us</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Welcome to HydroTech Solutions – your trusted online store for high-quality hydraulic cylinders. Since 2013, we've been serving industries across India with premium hydraulic products at competitive prices.
            </p>
            <p>
              We offer an extensive range of hydraulic cylinders including double acting cylinders, telescopic cylinders, and tie-rod cylinders suitable for construction, agriculture, mining, and manufacturing applications.
            </p>
            <p>
              Shop with confidence knowing that every product comes with manufacturer warranty, quality certification, and our commitment to customer satisfaction.
            </p>
          </div>
        </div>
      </section> */}

            <section className="border-b border-gray-200 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 text-center">
          {[
            { icon: <PackageCheck className="w-8 h-8 mx-auto mb-2" />, text: "10,000+ Products Sold" },
            { icon: <Users className="w-8 h-8 mx-auto mb-2" />, text: "500+ Happy Customers" },
            { icon: <Award className="w-8 h-8 mx-auto mb-2" />, text: "ISO Certified" },
            { icon: <Truck className="w-8 h-8 mx-auto mb-2" />, text: "Pan-India Delivery" },
          ].map((item, i) => (
            <div key={i}>
              {item.icon}
              <p className="text-sm font-medium text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
      <VisionMissionSection/>

    <ManufacturingProcessSection/>

    
      <WhyShopWithUs/>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Order?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Browse our complete catalog and get the best hydraulic cylinders delivered to your doorstep
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/products"
              className="bg-white text-gray-900 px-8 py-4 font-bold hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 font-bold hover:bg-white hover:text-gray-900 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>


      {/* Customer Reviews Section */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          What Our Customers Say
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Rajesh Kumar",
              company: "Kumar Construction, Mumbai",
              rating: 5,
              text: "Excellent product quality and fast delivery. Been ordering from HydroTech for 2 years now."
            },
            {
              name: "Priya Sharma",
              company: "Sharma Industries, Delhi",
              rating: 5,
              text: "Best prices in the market with genuine products. Customer support is very helpful."
            },
            {
              name: "Anil Patel",
              company: "Patel Enterprises, Gujarat",
              rating: 5,
              text: "Reliable supplier for all our hydraulic needs. Smooth ordering process and timely delivery."
            }
          ].map((review, i) => (
            <div key={i} className="border border-gray-200 p-6 bg-white">
              <div className="flex mb-3">
                {[...Array(review.rating)].map((_, idx) => (
                  <span key={idx} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4 text-sm italic">"{review.text}"</p>
              <p className="font-bold text-gray-900 text-sm">{review.name}</p>
              <p className="text-gray-600 text-xs">{review.company}</p>
            </div>
          ))}
        </div>
      </section>


    </div>
  );
};

export default AboutPage;