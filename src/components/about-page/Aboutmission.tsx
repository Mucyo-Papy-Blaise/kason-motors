"use client";

import React from "react";

interface StatProps {
  value: string;
  label: string;
  sub: string;
}

const Stat = ({ value, label, sub }: StatProps) => (
  <div className="flex items-start gap-4">
    <span className="text-5xl font-black text-primary leading-none">
      {value}
    </span>
    <div>
      <p className="font-bold text-font text-base leading-tight">{label}</p>
      <p className="text-gray-mid text-sm mt-1 leading-snug max-w-50">{sub}</p>
    </div>
  </div>
);

export const AboutMission = () => (
  <section className="py-20 bg-bg">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
      {/* Text */}
      <div>
        <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase block mb-3">
          Who We Are
        </span>
        <h2 className="text-3xl font-bold text-font mb-5 leading-tight">
          Our Mission &amp; Vision
        </h2>
        <p className="text-gray-mid leading-relaxed mb-4 text-sm">
          Kason Motor was established in 2014 and is one of the leading car
          exporters in China. With the vehicle export qualification certified by
          the Ministry of Commerce in China, we have been professionally
          specialized in the sales and service of new energy cars and gasoline
          cars for over 10 years.
        </p>
        <p className="text-gray-mid leading-relaxed mb-4 text-sm">
          We have our head office in Liaocheng, Shandong, as well as
          representative offices in Khorgos, Tashkent, Moscow and 4 African
          cities. Our experienced staff are well trained with professional
          technology and ready to provide any support warmly at any time.
        </p>
        <p className="text-gray-mid leading-relaxed text-sm mb-8">
          Kason Motor has its own stable and matured supply system and
          professional technical support as well as before and after-sales
          service — always aiming to make every customer enjoy a wonderful and
          satisfactory purchasing experience. We sincerely look forward to
          establishing long-term stable business partnerships with you.
        </p>

        <div className="space-y-6">
          <Stat
            value="10+"
            label="Years of Export Experience"
            sub="Professionally exporting new energy and gasoline vehicles since 2014."
          />
          <Stat
            value="8"
            label="Sales Offices Worldwide"
            sub="Head office in Shandong, China, plus offices in Central Asia, Russia & Africa."
          />
          <Stat
            value="50+"
            label="Cooperative Brands"
            sub="A wide portfolio of trusted vehicle brands to meet every customer need."
          />
          <Stat
            value="1,000+"
            label="Units Exported Each Year"
            sub="Mainly exported to Middle Asia, Russia, the Middle East and African markets."
          />
        </div>
      </div>

      {/* Image */}
      <div className="relative">
        <div className="rounded-2xl overflow-hidden shadow-xl aspect-4/3">
          <img
            src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80"
            alt="Kason Motors team"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Floating badge */}
        <div className="absolute -bottom-5 -left-5 bg-primary text-font rounded-xl px-5 py-4 shadow-lg">
          <p className="text-2xl font-black">100%</p>
          <p className="text-xs font-semibold text-accent mt-0.5">
            Ministry of Commerce Certified
          </p>
        </div>
      </div>
    </div>
  </section>
);