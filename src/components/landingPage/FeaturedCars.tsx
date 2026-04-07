"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

type FeaturedCar = {
  id: number;
  title?: string;
  name?: string;
  brand?: string;
  model?: string;
  type?: string;
  body_type?: string;
  year?: number | string;
  fuel?: string;
  mileage?: number | string;
  price?: number | string;
  badge?: string;
  image?: string;
  image_urls?: string[];
};

export default function FeaturedCars() {
  const [cars, setCars] = useState<FeaturedCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const response = await fetch("/api/vehicles/getList");
        const result = await response.json();
        if (!response.ok || !result.success || !Array.isArray(result.data)) {
          setCars([]);
          return;
        }

        const latestSix = [...result.data]
          .sort((a, b) => Number(b.id || 0) - Number(a.id || 0))
          .slice(0, 6);
        setCars(latestSix);
      } catch {
        setCars([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  const featuredCars = useMemo(() => cars, [cars]);

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
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-9 w-9 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
            {featuredCars.map((car, i) => {
              const title = car.title || `${car.brand || ""} ${car.model || ""}`.trim() || car.name || "Vehicle";
              const bodyType = car.body_type || car.type || "-";
              const image = car.image_urls?.[0] || car.image || "";
              return (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="group relative overflow-hidden bg-white"
                >
                  <Link href={`/inventory/${car.id}`} className="block">
                    <div className="relative h-60 overflow-hidden">
                      {image ? (
                        <Image
                          src={image}
                          alt={title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />
                      {car.badge ? (
                        <div className="absolute top-0 left-0 z-10">
                          <span className="block px-3 py-1 text-[10px] font-black tracking-widest uppercase text-white bg-primary">
                            {car.badge}
                          </span>
                        </div>
                      ) : null}

                      <div className="absolute inset-0 flex flex-col justify-end gap-2 rounded-tr-[30px] rounded-bl-[30px] bg-gradient-to-t from-white/90 via-white/70 to-transparent p-3 text-sm transition-all duration-500 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                        <div>
                          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-600">
                            {car.year} · {bodyType}
                          </p>
                          <h3 className="mt-1 text-lg font-bold text-gray-900 truncate">{title}</h3>
                        </div>
                        <div className="grid grid-cols-2 text-[11px] text-gray-600">
                          <div className="flex items-center justify-between font-semibold text-gray-900">
                            Fuel
                            <span className="font-normal text-gray-500">{car.fuel || "-"}</span>
                          </div>
                          <div className="flex items-center justify-between font-semibold text-gray-900">
                            Mileage
                            <span className="font-normal text-gray-500">
                              {Number(car.mileage || 0).toLocaleString()} km
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-base">
                          <p className="text-2xl font-black text-primary">
                            {Number(car.price || 0).toLocaleString()} RWF
                          </p>
                          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.25em]">
                            View
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/inventory"
            className="flex items-center cursor-pointer hover:text-primary/80 gap-2 text-sm font-bold tracking-widest uppercase border-b-2 pb-0.5 transition-colors"
            style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
          >
            View All Cars <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
