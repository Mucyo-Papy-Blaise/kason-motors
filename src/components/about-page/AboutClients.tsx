"use client";

import React from "react";

const REGIONS = [
  { label: "Middle Asia", flag: "🌏", markets: ["Kazakhstan", "Uzbekistan", "Kyrgyzstan", "Tajikistan"] },
  { label: "Russia", flag: "🌍", markets: ["Moscow", "St. Petersburg", "Novosibirsk", "Ekaterinburg"] },
  { label: "Middle East", flag: "🌎", markets: ["UAE", "Saudi Arabia", "Kuwait", "Qatar"] },
  { label: "Africa", flag: "🌍", markets: ["Rwanda", "Kenya", "Tanzania", "Uganda"] },
];

const OFFICES = [
  { city: "Liaocheng", country: "China", role: "Head Office", icon: "🏢" },
  { city: "Khorgos", country: "China / Kazakhstan", role: "Representative Office", icon: "📍" },
  { city: "Tashkent", country: "Uzbekistan", role: "Representative Office", icon: "📍" },
  { city: "Moscow", country: "Russia", role: "Representative Office", icon: "📍" },
  { city: "Africa (×4)", country: "East & Central Africa", role: "Representative Offices", icon: "📍" },
];

export const AboutClients: React.FC = () => (
  <section className="py-20 bg-bg">
    <div className="max-w-7xl mx-auto px-6">

      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase block mb-3">
          Clients &amp; Cooperation
        </span>
        <h2 className="text-3xl font-bold text-font">
          Trusted by Clients Across the Globe
        </h2>
        <p className="text-gray-mid text-sm mt-3 max-w-xl mx-auto">
          With 8 sales offices across multiple continents and 1,000+ units
          exported every year, Kason Motor serves clients in Middle Asia,
          Russia, the Middle East and Africa — and we welcome new long-term
          partnerships.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">

        {/* Export Markets */}
        <div className="bg-gray-dark border border-line/25 p-8">
          <h3 className="font-bold text-font text-sm mb-6 uppercase tracking-widest text-xs text-primary">
            Export Markets
          </h3>
          <div className="space-y-5">
            {REGIONS.map((r) => (
              <div key={r.label} className="flex items-start gap-4">
                <span className="text-2xl shrink-0">{r.flag}</span>
                <div>
                  <p className="font-bold text-font text-sm mb-1">{r.label}</p>
                  <p className="text-gray-mid text-xs leading-relaxed">
                    {r.markets.join(" · ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Office Locations */}
        <div className="bg-gray-dark border border-line/25 p-8">
          <h3 className="font-bold text-font text-sm mb-6 uppercase tracking-widest text-xs text-primary">
            Our Office Network
          </h3>
          <div className="space-y-4">
            {OFFICES.map((o) => (
              <div
                key={o.city}
                className="flex items-start gap-3 pb-4 border-b border-line/15 last:border-0 last:pb-0"
              >
                <span className="text-lg shrink-0 mt-0.5">{o.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-font text-sm">{o.city}</p>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-primary bg-primary/10 px-2 py-0.5">
                      {o.role}
                    </span>
                  </div>
                  <p className="text-gray-mid text-xs mt-0.5">{o.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partnership CTA strip */}
      <div className="bg-primary/10 border border-primary/20 px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <p className="font-bold text-font text-sm mb-1">
            Looking to partner with Kason Motor?
          </p>
          <p className="text-gray-mid text-xs leading-relaxed max-w-lg">
            We welcome you to visit our company and seek cooperation. We
            sincerely look forward to establishing a long-term, stable business
            partnership with you.
          </p>
        </div>
        <button className="bg-primary hover:bg-primary-dark text-font font-bold text-sm px-6 py-3 transition-colors duration-200 shrink-0">
          Get In Touch
        </button>
      </div>

    </div>
  </section>
);