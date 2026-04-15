"use client";

import React from "react";

interface StrengthCardProps {
  number: string;
  title: string;
  description: string;
}

const STRENGTHS: StrengthCardProps[] = [
  {
    number: "01",
    title: "Competitive Prices",
    description:
      "Factory-direct sourcing and a mature supply chain allow us to offer highly competitive pricing across all vehicle categories — new energy and gasoline alike.",
  },
  {
    number: "02",
    title: "Fast Delivery",
    description:
      "With established sea shipping routes and logistics experience built over 10+ years, we ensure timely and reliable delivery to customers across Africa, the Middle East, Central Asia and Russia.",
  },
  {
    number: "03",
    title: "Strong Finance Support",
    description:
      "We provide strong financing options tailored to both individual buyers and large-scale fleet procurement, making vehicle acquisition accessible and flexible.",
  },
  {
    number: "04",
    title: "Various Payment Collection Channels",
    description:
      "We support multiple international payment methods, making transactions smooth and convenient for clients across different regions and banking systems.",
  },
  {
    number: "05",
    title: "Excellent After-Sales Service",
    description:
      "Our dedicated after-sales team provides ongoing support, technical assistance, and maintenance guidance to ensure every customer's long-term satisfaction.",
  },
  {
    number: "06",
    title: "Spare Parts Supply",
    description:
      "We maintain a stable and mature spare parts supply chain, ensuring fast access to genuine components and minimising vehicle downtime for our clients.",
  },
];

export const AboutStrengths = () => (
  <section className="py-20 bg-primary-dark text-white overflow-hidden relative">
    {/* Decorative circles */}
    <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/30 blur-3xl" />
    <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-accent/10 blur-2xl" />

    <div className="relative max-w-6xl mx-auto px-6">
      <div className="text-center mb-14">
        <span className="text-accent text-xs font-bold tracking-[0.2em] uppercase block mb-3">
          Why Choose Us
        </span>
        <h2 className="text-3xl font-bold text-font">Our Service Advantages</h2>
        <p className="text-font/60 text-sm mt-3 max-w-lg mx-auto">
          Kason Motor is built on reliability, competitive value, and a
          customer-first approach — backed by over a decade of proven export
          experience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {STRENGTHS.map((s) => (
          <div
            key={s.number}
            className="relative pl-5 border-l-2 border-font/20 hover:border-accent transition-colors duration-300 group"
          >
            <p className="text-[10px] font-black tracking-widest text-accent/60 group-hover:text-accent transition-colors mb-1 uppercase">
              {s.number}
            </p>
            <h4 className="font-bold text-font text-sm mb-1.5">{s.title}</h4>
            <p className="text-font/55 text-xs leading-relaxed">
              {s.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);