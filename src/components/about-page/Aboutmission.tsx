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
      <p className="text-gray-mid text-sm mt-1 leading-snug max-w-50">
        {sub}
      </p>
    </div>
  </div>
);

export const AboutMission  = () => (
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
          Kason Motor Ltd is an automotive and green mobility company
          headquartered in the Kigali Special Economic Zone (KSEZ) Phase 2 in
          Masoro, Ndera, Kigali. We operate at the intersection of vehicle
          distribution and sustainable transport solutions, positioning
          ourselves as a key player in Rwanda&apos;s transition toward cleaner
          mobility.
        </p>
        <p className="text-gray-mid leading-relaxed text-sm mb-8">
          Our mission is to drive electrification in Rwanda by delivering
          customized, sustainable mobility solutions — and to become a leading
          force in Rwanda&apos;s transition to cleaner, smarter transportation,
          serving as a pioneer in green mobility collaboration.
        </p>

        <div className="space-y-6">
          <Stat
            value="38+"
            label="Years on the Market"
            sub="Founded in 1986 in Liaocheng, Shandong, China — decades of automotive expertise."
          />
          <Stat
            value="6+"
            label="Vehicle Categories"
            sub="From luxury cars to commercial vehicles and New Energy Vehicles (NEVs)."
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
            Factory-Backed Guarantee
          </p>
        </div>
      </div>
    </div>
  </section>
);
