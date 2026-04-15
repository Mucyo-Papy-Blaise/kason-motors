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
    <p className="text-sm font-semibold text-font leading-tight max-w-30">
      {title}
    </p>
  </div>
);

const ShipIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M2 21c.6.5 1.2 1 2.5 1C7 22 7 21 9.5 21s2.5 1 5 1 2.5-1 5-1c1.3 0 1.9.5 2.5 1" />
    <path d="M19.38 20A11.6 11.6 0 0012 20a11.6 11.6 0 00-7.38 0" />
    <path d="M12 3v13.5" />
    <path d="M3.5 13.5L12 3l8.5 10.5" />
  </svg>
);

const GlobalIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

const CertIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export const AboutCta: React.FC = () => (
  <section className="py-20 bg-bg">
    <div className="max-w-7xl mx-auto px-6 space-y-6">

      {/* Main CTA card */}
      <div className="bg-gray-dark border border-line/25 shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left */}
          <div className="p-10 md:p-14 flex flex-col justify-center">
            <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase block mb-3">
              Find Out More
            </span>
            <h2 className="text-3xl font-bold text-font leading-tight mb-4">
              Your Trusted Global Auto Export Partner
            </h2>
            <p className="text-gray-mid text-sm leading-relaxed mb-8">
              With over 10 years of certified export experience, 8 offices
              worldwide, and a stable supply chain of 50+ brands, Kason Motor
              is ready to deliver the right vehicle solution — whether you need
              a single car or a full fleet. We export to Middle Asia, Russia,
              the Middle East and Africa, and we welcome long-term business
              partnerships.
            </p>

            <div className="flex flex-wrap gap-6 mb-10">
              <Pillar icon={<ShipIcon />} title="Sea Shipping Worldwide" />
              <Pillar icon={<GlobalIcon />} title="8 Global Offices" />
              <Pillar icon={<CertIcon />} title="Ministry Certified" />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button className="bg-primary hover:bg-primary-dark text-font font-bold text-sm px-6 py-3 transition-colors duration-200">
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
              alt="Vehicle export shipping"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-transparent md:hidden" />
          </div>
        </div>
      </div>

      {/* Transport Ways strip */}
      <div className="bg-gray-dark border border-line/25 px-10 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-primary/10 flex items-center justify-center text-primary">
            <ShipIcon />
          </div>
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">
            Transport Ways
          </span>
        </div>
        <div className="w-px h-8 bg-line/25 hidden sm:block" />
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-4 py-2">
            <ShipIcon />
            Sea Shipping
          </span>
          <p className="text-gray-mid text-xs leading-relaxed max-w-md">
            All vehicles are exported via sea freight — a reliable, cost-effective
            method for delivering cars across our global markets in Africa, the
            Middle East, Central Asia and Russia.
          </p>
        </div>
      </div>

    </div>
  </section>
);