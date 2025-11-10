'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: 'https://res.cloudinary.com/dvywl117x/image/upload/v1762164778/ecom_products/thumbnails/double_acting_hydraulic%20-%20Copy.png'
    },
    {
      id: 2,
      image: 'https://res.cloudinary.com/dvywl117x/image/upload/v1762164778/ecom_products/thumbnails/double_acting_hydraulic%20-%20Copy.png'
    },
    {
      id: 3,
      image: 'https://res.cloudinary.com/dvywl117x/image/upload/v1762164778/ecom_products/thumbnails/double_acting_hydraulic%20-%20Copy.png'
    }
  ];

  // Extended slides array for infinite loop
  const extendedSlides = [...slides, ...slides, ...slides];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentSlide >= slides.length * 2) {
      setCurrentSlide(slides.length);
    }
  }, [currentSlide, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 >= 0 ? prev - 1 : slides.length - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(slides.length + index);
  };

  return (
    <div className="min-h-fit bg-white overflow-hidden container mx-auto">

      <div className="relative h-fit flex items-stretch overflow-hidden">

        <div className="w-1/2 flex flex-col justify-between xl:p-6 2xl:p-14">
                      
          <div className="mb-20">
            <h1 className=" text-5xl 2xl:text-6xl font-medium text-gray-900 leading-tight transition-all duration-500">
              High-Pressure 
            </h1>
             <h2 className='text-gray-500 mb-6 text-5xl 2xl:text-6xl font-medium'>Hydraulic Solutions</h2>


            <p className="text-gray-600 text-lg font-light leading-relaxed max-w-2xl transition-all duration-500">
              Designed for maximum strength and endurance, our cylinders deliver consistent performance across industrial, mobile, and heavy-machinery applications. Built with precision components and strict quality control for long service life.
            </p>
          </div>

        
          <div className="space-y-8">
            <button className="group relative inline-block">
              <Link href="/products" className="text-sm font-semibold text-gray-900 tracking-widest uppercase transition">
                Explore Products
              </Link>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </button>

            <div className="flex gap-4">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`transition-all duration-300 ${
                    (currentSlide % slides.length) === idx
                      ? 'w-12 h-1 bg-gray-900'
                      : 'w-4 h-1 bg-gray-300 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="w-1/2 relative overflow-hidden bg-white">
          <div
            className="flex transition-transform duration-700 ease-out h-full w-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {extendedSlides.map((item, idx) => (
              <div
                key={idx}
                className="w-full h-full flex-shrink-0 relative flex items-center justify-center"
              >
                <img
                  src={item.image}
                  alt="Hydraulic Cylinder"
                  className="w-full h-96 object-contain"
                />
              </div>
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-12 top-1/2 -translate-y-1/2 CartProduct group"
          >
            <div className="w-14 h-14 border border-gray-300 rounded-full flex items-center justify-center group-hover:border-gray-900 group-hover:bg-white transition">
              <ChevronLeft size={24} className="text-gray-600 group-hover:text-gray-900 transition" />
            </div>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-12 top-1/2 -translate-y-1/2 CartProduct group"
          >
            <div className="w-14 h-14 border border-gray-300 rounded-full flex items-center justify-center group-hover:border-gray-900 group-hover:bg-white transition">
              <ChevronRight size={24} className="text-gray-600 group-hover:text-gray-900 transition" />
            </div>
          </button>

          <div className="absolute bottom-12 left-12 CartProduct">
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-full shadow-lg">
              <Zap size={18} className="text-gray-900" />
              <span className="text-sm font-medium text-gray-900">Heavy Duty Grade</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}