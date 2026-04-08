"use client";

import React from "react";

interface PillarProps {
  icon: React.ReactNode;
  title: string;
}

const Pillar: React.FC<PillarProps> = ({ icon, title }) => (
  <div className="flex flex-col items-center gap-3 text-center">
    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
      {icon}
    </div>
    <p className="text-sm font-semibold text-ink leading-tight max-w-30">
      {title}
    </p>
  </div>
);

const EvIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L4.09 12.96A1 1 0 005 14.5h6.5L11 22l8.91-10.96A1 1 0 0019 9.5h-6.5L13 2z" />
  </svg>
);

const InfraIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="16" />
    <line x1="10" y1="14" x2="14" y2="14" />
  </svg>
);

const CityIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const AboutCta: React.FC = () => (
  <section className="py-20 bg-subtle">
    <div className="max-w-7xl mx-auto px-6">
      <div className="bg-bg  border border-line shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left */}
          <div className="p-10 md:p-14 flex flex-col justify-center">
            <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase block mb-3">
              Find Out More
            </span>
            <h2 className="text-3xl font-bold text-ink leading-tight mb-4">
              Rwanda&apos;s Green Mobility Partner
            </h2>
            <p className="text-gray-mid text-sm leading-relaxed mb-8">
              Aligned with Rwanda&apos;s national push for green growth and electric
              mobility, Kason Motor Ltd plays a critical role in expanding EV
              adoption, supporting charging infrastructure, and enabling
              sustainable urban transport. We&apos;re not just a car distributor —
              we&apos;re a mobility ecosystem builder.
            </p>

            <div className="flex flex-wrap gap-6 mb-10">
              <Pillar icon={<EvIcon />} title="Expanding EV Adoption" />
              <Pillar icon={<InfraIcon />} title="Charging Infrastructure" />
              <Pillar icon={<CityIcon />} title="Sustainable Urban Transport" />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button className="bg-primary hover:bg-primary-dark text-white font-bold text-sm px-6 py-3 transition-colors duration-200">
                Our Services
              </button>
              <button className="border border-primary text-primary hover:bg-primary/5 font-bold text-sm px-6 py-3 transition-colors duration-200">
                Contact Us
              </button>
            </div>
          </div>

          {/* Right image */}
          <div className="relative min-h-[280px] md:min-h-0">
            <img
              src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80"
              alt="Electric vehicle charging"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-transparent md:hidden" />
          </div>
        </div>
      </div>
    </div>
  </section>
);
