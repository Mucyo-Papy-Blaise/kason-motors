"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const filters = ["All Conditions", "New Cars", "Used Cars", "Certified"];

export default function SearchBar() {
  const [filter, setFilter] = useState("All Conditions");

  return (
    <section className="bg-white shadow-xl relative z-30">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">
              I&apos;m Looking For
            </span>
            <div className="flex gap-1 ml-3">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded text-xs font-bold tracking-wide uppercase transition-all ${
                    filter === f
                      ? "text-white bg-primary"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <span className="text-xs font-bold tracking-widest uppercase">
           <span className="text-primary">128 Cars</span>
          </span>
        </div>

        {/* Search Fields */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {[
            { label: "MAKE", placeholder: "All makes" },
            { label: "MODEL", placeholder: "All models" },
            { label: "PRICE", placeholder: "All prices" },
            { label: "LOCATION", placeholder: "Town, city or postcode" },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-xs font-bold text-gray-400 tracking-widest block mb-1">
                {field.label}
              </label>
              <select className="w-full py-3 px-4 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:border-primary bg-white appearance-none cursor-pointer">
                <option>{field.placeholder}</option>
              </select>
            </div>
          ))}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <button className="text-xs font-bold text-gray-500 hover:text-primary uppercase tracking-widest flex items-center gap-1 transition-colors">
            ▾ Advanced Search
          </button>
          <div className="flex items-center gap-4">
            <button className="text-xs text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors">
              ↺ Reset All
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-3 bg-primary text-white font-bold rounded text-sm uppercase tracking-widest"
            >
              Search
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
