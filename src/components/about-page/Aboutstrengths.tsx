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
    title: "Factory-Backed Guarantee",
    description:
      "All vehicles are supported by direct manufacturer guarantees — authentic, high-quality products with reliable warranties.",
  },
  {
    number: "02",
    title: "Direct Factory Expertise",
    description:
      "Technical support from factory-trained experts with up-to-date knowledge of the latest vehicle and EV technologies.",
  },
  {
    number: "03",
    title: "Longstanding Experience Since 1986",
    description:
      "Built on a foundation of decades of experience with a deep understanding of African market conditions and customer needs.",
  },
  {
    number: "04",
    title: "Reliable Spare Parts Availability",
    description:
      "Strong and stable spare parts supply chain with quick access to genuine parts, reducing downtime for customers and fleets.",
  },
  {
    number: "05",
    title: "Professional & Skilled Team",
    description:
      "Highly trained local and international staff with expertise across sales, technical support, EV systems, and fleet management.",
  },
  {
    number: "06",
    title: "Complete Mobility Ecosystem",
    description:
      "Unlike competitors who only sell vehicles, we provide vehicles, charging infrastructure, after-sales service, financing and fleet solutions.",
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
          Our Competitive Edge
        </span>
        <h2 className="text-3xl font-bold text-white">What Makes Us Unique</h2>
        <p className="text-white/60 text-sm mt-3 max-w-lg mx-auto">
          Kason Motor differentiates itself through factory-level support,
          decades of experience, and full-service capability tailored to
          Rwanda&apos;s evolving market.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {STRENGTHS.map((s) => (
          <div
            key={s.number}
            className="relative pl-5 border-l-2 border-white/20 hover:border-accent transition-colors duration-300 group"
          >
            <p className="text-[10px] font-black tracking-widest text-accent/60 group-hover:text-accent transition-colors mb-1 uppercase">
              {s.number}
            </p>
            <h4 className="font-bold text-white text-sm mb-1.5">{s.title}</h4>
            <p className="text-white/55 text-xs leading-relaxed">
              {s.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
