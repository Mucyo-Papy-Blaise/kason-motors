"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import { cars } from "@/lib/mockData";
import Image from "next/image";

const tabs = ["All", "Best Seller", "New Arrival", "Popular", "Used"];

export default function FeaturedCars() {
  const [activeTab, setActiveTab] = useState("All");
  const [saved, setSaved] = useState<number[]>([]);

  const filtered =
    activeTab === "All" ? cars : cars.filter((c) => c.badge === activeTab);

  const toggleSave = (id: number) =>
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p
              className="text-sm font-bold tracking-widest uppercase mb-2"
              style={{ color: "var(--primary)" }}
            >
              Our Fleet
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Featured Cars
            </h2>
          </div>

          <div className="flex gap-0 border border-gray-200 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all ${
                  activeTab === tab
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
                style={activeTab === tab ? { background: "var(--primary)" } : {}}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((car, i) => (
              <motion.div
                key={car.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="group relative overflow-hidden bg-white"
              >
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={car.image}
                    alt={car.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />

                  <div className="absolute top-0 left-0 z-10">
                    <span
                      className="block px-3 py-1 text-[10px] font-black tracking-widest uppercase text-white"
                      style={{ background: "var(--primary)" }}
                    >
                      {car.badge}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleSave(car.id)}
                    className={`absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center transition-all duration-200 ${
                      saved.includes(car.id)
                        ? "bg-primary text-white"
                        : "bg-white/90 text-gray-400 hover:text-primary opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <Heart
                      size={14}
                      fill={saved.includes(car.id) ? "white" : "none"}
                    />
                  </button>

                  <div className="absolute inset-0 flex flex-col justify-end gap-2 rounded-tr-[30px] rounded-bl-[30px] bg-gradient-to-t from-white/90 via-white/70 to-transparent p-3 text-sm transition-all duration-500 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                    <div>
                      <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-600">
                        {car.year} · {car.type}
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-gray-900 truncate">
                        {car.name}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 text-[11px] text-gray-600">
                      <div className="flex items-center justify-between font-semibold text-gray-900">
                        Fuel
                        <span className="font-normal text-gray-500">{car.fuel}</span>
                      </div>
                      <div className="flex items-center justify-between font-semibold text-gray-900">
                        Mileage
                        <span className="font-normal text-gray-500">
                          {car.mileage.toLocaleString()} km
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-base">
                      <div>
                        <p
                          className="text-2xl font-black"
                          style={{ color: "var(--primary)" }}
                        >
                          ${car.price.toLocaleString()}
                        </p>
                        <p className="text-[10px] font-semibold text-gray-500">
                          / month
                        </p>
                      </div>
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.25em]">
                        View
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-10 flex justify-center">
          <button
            className="flex items-center cursor-pointer hover:text-primary/80 gap-2 text-sm font-bold tracking-widest uppercase border-b-2 pb-0.5 transition-colors"
            style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
          >
            View All Cars <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
