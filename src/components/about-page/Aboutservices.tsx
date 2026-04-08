"use client";

import React from "react";

interface ServiceCardProps {
  icon: React.ReactNode;
  number: string;
  title: string;
  items: string[];
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  number,
  title,
  items,
}) => (
  <div className="bg-surface border border-line  p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300 group">
    <div className="flex items-start gap-3 mb-4">
      <div className="w-10 h-10  bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold tracking-widest text-gray-mid uppercase">
          {number}
        </p>
        <h3 className="font-bold text-ink text-sm leading-tight">{title}</h3>
      </div>
    </div>
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2 text-xs text-gray-mid leading-snug"
        >
          <span className="w-1 h-1 rounded-full bg-primary shrink-0 mt-1.5" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const CarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z" />
    <circle cx="7.5" cy="14.5" r="1.5" />
    <circle cx="16.5" cy="14.5" r="1.5" />
  </svg>
);

const ZapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L4.09 12.96A1 1 0 005 14.5h6.5L11 22l8.91-10.96A1 1 0 0019 9.5h-6.5L13 2z" />
  </svg>
);

const WrenchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
  </svg>
);

const TruckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="1" y="3" width="15" height="13" />
    <path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const CreditIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

const SERVICES: ServiceCardProps[] = [
  {
    icon: <CarIcon />,
    number: "01",
    title: "Vehicle Products",
    items: [
      "Luxury & executive cars",
      "Mid-size, compact & mini cars",
      "Commercial vehicles",
      "New Energy Vehicles (NEVs & PHEVs)",
    ],
  },
  {
    icon: <ZapIcon />,
    number: "02",
    title: "Charging & Energy Solutions",
    items: [
      "Smart home charging systems",
      "Public fast-charging stations",
      "Customized solutions for homes, businesses & fleets",
    ],
  },
  {
    icon: <WrenchIcon />,
    number: "03",
    title: "After-Sales & Technical Services",
    items: [
      "Professional maintenance & repair",
      "Reliable spare parts supply",
      "Technical support for EVs & conventional vehicles",
    ],
  },
  {
    icon: <TruckIcon />,
    number: "04",
    title: "Fleet & Operational Solutions",
    items: [
      "Full lifecycle fleet management",
      "Solutions for government, embassies & logistics",
      "Performance monitoring & optimization",
    ],
  },
  {
    icon: <CreditIcon />,
    number: "05",
    title: "Financial & Business Support",
    items: [
      "Flexible financing for individuals & businesses",
      "Large-scale fleet acquisition support",
      "Advisory on EV transition",
    ],
  },
  {
    icon: <GlobeIcon />,
    number: "06",
    title: "Integrated Mobility Solutions",
    items: [
      "Localized EV solutions for Rwanda & East Africa",
      "Vehicles + charging + services + financing",
      "Long-term sustainable mobility partnerships",
    ],
  },
];

export const AboutServices: React.FC = () => (
  <section className="py-20 bg-subtle">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-12">
        <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase block mb-3">
          What We Offer
        </span>
        <h2 className="text-3xl font-bold text-ink">
          A Complete Mobility Ecosystem
        </h2>
        <p className="text-gray-mid text-sm mt-3 max-w-xl mx-auto">
          Beyond selling cars — we deliver end-to-end solutions from vehicle
          acquisition to daily operations and long-term sustainability.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SERVICES.map((s) => (
          <ServiceCard key={s.number} {...s} />
        ))}
      </div>
    </div>
  </section>
);
