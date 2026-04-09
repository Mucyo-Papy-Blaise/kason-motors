"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CarCard } from "./inventory/Carcard";
import type { InventoryCar } from "./inventory/Carlistingpage";
import {
  readVehicleListCache,
  writeVehicleListCache,
} from "@/lib/vehiclesListCache";

function sliceFeatured(data: InventoryCar[]): InventoryCar[] {
  return [...data]
    .sort((a, b) => Number(b.id || 0) - Number(a.id || 0))
    .slice(0, 6);
}

export default function FeaturedCars() {
  const [cars, setCars] = useState<InventoryCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const cached = readVehicleListCache<InventoryCar>();
      if (cached?.length) {
        setCars(sliceFeatured(cached));
        setIsLoading(false);
      }

      try {
        const response = await fetch("/api/vehicles/getList");
        const result = await response.json();
        if (cancelled) return;
        if (!response.ok || !result.success || !Array.isArray(result.data)) {
          if (!cached?.length) setCars([]);
          return;
        }
        writeVehicleListCache(result.data);
        setCars(sliceFeatured(result.data as InventoryCar[]));
      } catch {
        if (!cancelled && !cached?.length) setCars([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof window === "undefined") return;
    if (window.innerWidth >= 768) return;
    if (cars.length === 0) return;

    const step = el.clientWidth * 0.88;
    let direction = 1;
    const interval = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      let nextScroll = el.scrollLeft + direction * step;
      if (nextScroll >= maxScroll) {
        nextScroll = maxScroll;
        direction = -1;
      } else if (nextScroll <= 0) {
        nextScroll = 0;
        direction = 1;
      }
      el.scrollTo({ left: nextScroll, behavior: "smooth" });
    }, 10000);

    return () => clearInterval(interval);
  }, [cars.length]);

  const featuredCars = useMemo(() => cars, [cars]);
  const showSkeleton = isLoading && featuredCars.length === 0;

  return (
    <section className="bg-bg px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-6 sm:mb-10 md:mb-12 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-font">
              Our Fleet
            </p>
            <h2 className="text-3xl font-bold text-primary-light md:text-4xl">
              Featured Cars
            </h2>
          </div>
        </div>

        {showSkeleton ? (
          <div className="flex min-h-[240px] items-center justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          </div>
        ) : (
          <>
            <div className="md:hidden">
              <div
                ref={scrollRef}
                className="flex touch-pan-x gap-4 overflow-x-auto px-1 pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {featuredCars.map((car, i) => (
                  <div
                    key={car.id}
                    className="w-[min(88vw,22rem)] shrink-0 snap-center"
                  >
                    <motion.div
                      className="h-full"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.05 }}
                    >
                      <CarCard car={car} />
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-3">
              {featuredCars.map((car, i) => (
                <motion.div
                  key={car.id}
                  className="h-full"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  <CarCard car={car} />
                </motion.div>
              ))}
            </div>
          </>
        )}

        <div className="mt-6 flex justify-center sm:mt-10">
          <Link
            href="/inventory"
            className="flex cursor-pointer items-center gap-2 border-b-2 pb-0.5 text-sm font-bold uppercase tracking-widest text-font transition-colors hover:text-primary/80"
          >
            View All Cars <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
