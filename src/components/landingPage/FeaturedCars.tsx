"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CarCard } from "./inventory/Carcard";
import type { InventoryCar } from "./inventory/Carlistingpage";

export default function FeaturedCars() {
  const [cars, setCars] = useState<InventoryCar[]>([]);
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
          .slice(0, 6) as InventoryCar[];
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
    <section className="py-20 px-6 bg-bg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p
              className="text-sm font-bold tracking-widest uppercase mb-2 text-font"
            >
              Our Fleet
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-light">
              Featured Cars
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-9 w-9 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/inventory"
            className="flex items-center cursor-pointer hover:text-primary/80 gap-2 text-sm font-bold tracking-widest uppercase border-b-2 pb-0.5 transition-colors text-font"
          >
            View All Cars <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
