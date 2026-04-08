"use client";

import React from "react";

interface AudienceItemProps {
  emoji: string;
  title: string;
  description: string;
}

const AudienceItem: React.FC<AudienceItemProps> = ({
  emoji,
  title,
  description,
}) => (
  <div className="flex items-start gap-4 p-4 hover:bg-primary/5 transition-colors duration-200">
    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl shrink-0">
      {emoji}
    </div>
    <div>
      <h4 className="font-bold text-font text-sm mb-1">{title}</h4>
      <p className="text-gray-mid text-xs leading-relaxed">{description}</p>
    </div>
  </div>
);

const AUDIENCES: AudienceItemProps[] = [
  {
    emoji: "🏛️",
    title: "Public Sector & Institutions",
    description:
      "Government ministries, parastatals, and official state offices needing executive vehicles and green fleet solutions.",
  },
  {
    emoji: "🏫",
    title: "Education & Social Institutions",
    description:
      "Schools, universities, churches, and faith-based organizations needing safe, cost-efficient transport like buses and minibuses.",
  },
  {
    emoji: "🏭",
    title: "Private Sector & Industry",
    description:
      "Corporations, SMEs, factories, and logistics companies seeking commercial vehicles and fleet management.",
  },
  {
    emoji: "🌍",
    title: "Diplomatic & International Organizations",
    description:
      "Embassies, consulates, NGOs, and international agencies requiring reliable, high-quality executive vehicles.",
  },
  {
    emoji: "🚖",
    title: "Transport & Mobility Operators",
    description:
      "Taxi drivers, ride-hailing operators, and fleet owners benefiting from affordable electric vehicles with lower operating costs.",
  },
  {
    emoji: "👤",
    title: "Individual & Corporate Buyers",
    description:
      "Professionals and entrepreneurs seeking anything from compact urban cars to luxury and hybrid models.",
  },
];

export const AboutAudience: React.FC = () => (
  <section className="py-20 bg-bg">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
      {/* Image side */}
      <div className="relative order-2 md:order-1">
        <div className="overflow-hidden shadow-xl aspect-square max-w-md mx-auto">
          <img
            src="https://images.pexels.com/photos/32644774/pexels-photo-32644774.jpeg"
            alt="Kason Motors clients"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Accent stripe */}
        <div className="absolute -top-4 -right-4 w-24 h-24  bg-accent/30 -z-10" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/20 -z-10" />
      </div>

      {/* Content */}
      <div className="order-1 md:order-2">
        <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase block mb-3">
          Who We Serve
        </span>
        <h2 className="text-3xl font-bold text-font mb-3 leading-tight">
          Our Target Audience
        </h2>
        <p className="text-gray-mid text-sm leading-relaxed mb-6">
          Kason Motor Ltd serves a broad, multi-sector client base across Rwanda
          and the wider East African region, focusing on organizations and
          individuals seeking reliable and sustainable mobility solutions.
        </p>

        <div className="space-y-1">
          {AUDIENCES.map((a) => (
            <AudienceItem key={a.title} {...a} />
          ))}
        </div>
      </div>
    </div>
  </section>
);
