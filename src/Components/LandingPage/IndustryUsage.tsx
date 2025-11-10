"use client";

import Image from "next/image";
import React from "react";
import Suspension from "@/assets/Usage/Suspension.jpg";
import Steering from "@/assets/Usage/steering.jpg";
import Tailgate from "@/assets/Usage/Tailgate.jpg";
import Presses from "@/assets/Usage/presses.jpg";
import Brake from "@/assets/Usage/Brake.jpg";
import Lifting from "@/assets/Usage/Automotive.jpg";

const Uses = [
  {
    id: 1,
    title: "Car Lifting Systems",
    description:
      "Hydraulic cylinders power vehicle lifts in service stations and garages for smooth, stable lifting and lowering.",
    image: Lifting,
  },
  {
    id: 2,
    title: "Brake Systems",
    description:
      "Used in hydraulic brake systems to convert pressure into stopping force for safe and controlled braking.",
    image: Brake,
  },
  {
    id: 3,
    title: "Suspension Systems",
    description:
      "Provide damping and stability for a comfortable ride by absorbing shocks and vibrations on rough roads.",
    image: Suspension,
  },
  {
    id: 4,
    title: "Steering Mechanisms",
    description:
      "Assist with effortless steering control using hydraulic pressure in power steering systems.",
    image: Steering,
  },
  {
    id: 5,
    title: "Convertible Roof & Tailgate Systems",
    description:
      "Enable smooth operation of car roofs, hoods, and tailgates through compact hydraulic actuators.",
    image: Tailgate,
  },
  {
    id: 6,
    title: "Hydraulic Presses in Manufacturing",
    description:
      "Used in automotive production for forming, pressing, and assembling metal components.",
    image: Presses,
  },
];

export default function IndustryUsage() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-6">
       <h2 className="text-4xl font-semibold text-gray-900 mb-6  tracking-tight">
            Hydraulic Cylinder
            <br />
            <span className="text-gray-400">Applications</span>
          </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {Uses.map((use) => (
            <div
              key={use.id}
              className="group relative bg-white rounded-xl overflow-hidden hover:border shadow-md hover:shadow-xl transition-all duration-500"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={use.image}
                  alt={use.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 transition-colors">
                  {use.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {use.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
