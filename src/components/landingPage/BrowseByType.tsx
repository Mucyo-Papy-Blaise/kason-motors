"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  readVehicleListCache,
  writeVehicleListCache,
} from "@/lib/vehiclesListCache";

const VISIBLE = 5;

type TypeCard = {
  label: string;
  count: number;
  image?: string;
};

type VehicleItem = {
  body_type?: string;
  type?: string;
  image?: string;
  image_urls?: string[];
};

function buildCarTypesFromVehicles(data: VehicleItem[]): TypeCard[] {
  const map = new Map<string, TypeCard>();
  data.forEach((car) => {
    const label = (car.body_type || car.type || "").trim();
    if (!label) return;

    const existing = map.get(label);
    if (existing) {
      existing.count += 1;
      if (!existing.image) {
        existing.image = car.image_urls?.[0] || car.image;
      }
      return;
    }

    map.set(label, {
      label,
      count: 1,
      image: car.image_urls?.[0] || car.image,
    });
  });

  return Array.from(map.values()).sort((a, b) =>
    a.label.localeCompare(b.label),
  );
}

export default function BrowseByType() {
  const [carTypes, setCarTypes] = useState<TypeCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [start, setStart] = useState(0);
  const total = carTypes.length;
  const canPrev = start > 0;
  const canNext = start + VISIBLE < total;
  const scrollRef = useRef<HTMLDivElement>(null);

  const prev = () => setStart((s) => Math.max(0, s - 1));
  const next = () => setStart((s) => Math.min(total - VISIBLE, s + 1));
  const visible = carTypes.slice(start, start + VISIBLE);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const cached = readVehicleListCache<VehicleItem>();
      if (cached?.length) {
        setCarTypes(buildCarTypesFromVehicles(cached));
        setIsLoading(false);
      }

      try {
        const response = await fetch("/api/vehicles/getList");
        const result = await response.json();
        if (cancelled) return;
        if (!response.ok || !result.success || !Array.isArray(result.data)) {
          if (!cached?.length) setCarTypes([]);
          return;
        }
        writeVehicleListCache(result.data);
        setCarTypes(buildCarTypesFromVehicles(result.data as VehicleItem[]));
      } catch {
        if (!cancelled && !cached?.length) setCarTypes([]);
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
    if (carTypes.length === 0) return;

    const step = el.clientWidth * 0.9;
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
  }, [carTypes.length]);

  const showSkeleton = isLoading && carTypes.length === 0;

  return (
    <section className="-mt-20 bg-bg px-6 pb-20 pt-0">
      <div className="mx-auto max-w-7xl pt-32">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-bold uppercase tracking-widest text-font">
              Explore
            </p>
            <h2 className="text-3xl font-bold text-primary-light md:text-4xl">
              Browse By Type
            </h2>
          </div>

          <div className="mt-1 flex shrink-0 items-center gap-3">
            <Link
              href="/inventory"
              className="hidden text-sm font-semibold text-font hover:underline sm:block"
            >
              See All Types →
            </Link>
            <div className="hidden gap-1 md:flex">
              <button
                type="button"
                onClick={prev}
                disabled={!canPrev}
                className={`flex h-8 w-8 items-center justify-center border transition-all ${
                  canPrev
                    ? "border-line/40 text-font hover:border-primary hover:text-primary"
                    : "cursor-not-allowed border-line/15 text-gray-mid"
                }`}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!canNext}
                className={`flex h-8 w-8 items-center justify-center border transition-all ${
                  canNext
                    ? "border-line/40 text-font hover:border-primary hover:text-primary"
                    : "cursor-not-allowed border-line/15 text-gray-mid"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {showSkeleton ? (
          <div className="flex min-h-[220px] items-center justify-center py-12 md:min-h-[280px]">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          </div>
        ) : (
          <>
            <div className="md:hidden">
              <div
                ref={scrollRef}
                className="flex touch-pan-x gap-4 overflow-x-auto px-2 pb-6 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {carTypes.map((type, i) => (
                  <Link
                    key={`${type.label}-mobile`}
                    href={`/inventory?bodyType=${encodeURIComponent(type.label)}`}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.35 }}
                      className="group relative aspect-[4/3] min-w-[75vw] shrink-0 cursor-pointer snap-center overflow-hidden"
                    >
                      {type.image ? (
                        <Image
                          src={type.image}
                          alt={type.label}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-dark" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/15" />
                      <div className="absolute bottom-0 left-0 right-0 z-20 p-3">
                        <p className="text-sm font-bold leading-tight text-font">
                          {type.label}
                        </p>
                        <p className="mt-0.5 text-xs text-font/70">
                          {type.count} Cars
                        </p>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 z-30 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden gap-0.5 md:grid md:grid-cols-3 lg:grid-cols-5">
              <AnimatePresence mode="popLayout">
                {visible.map((type, i) => (
                  <Link
                    key={type.label}
                    href={`/inventory?bodyType=${encodeURIComponent(type.label)}`}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ delay: i * 0.06, duration: 0.35 }}
                      className="group relative aspect-[4/3] cursor-pointer overflow-hidden"
                    >
                      {type.image ? (
                        <Image
                          src={type.image}
                          alt={type.label}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-dark" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/15" />
                      <div className="absolute bottom-0 left-0 right-0 z-20 p-3">
                        <p className="text-sm font-bold leading-tight text-font">
                          {type.label}
                        </p>
                        <p className="mt-0.5 text-xs text-font/70">
                          {type.count} Cars
                        </p>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 z-30 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
                    </motion.div>
                  </Link>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}

        <div className="mt-5 sm:hidden">
          <Link
            href="/inventory"
            className="text-sm font-semibold text-font hover:underline"
          >
            See All Types →
          </Link>
        </div>
      </div>
    </section>
  );
}
