"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

export default function BrowseByType() {
  const [carTypes, setCarTypes] = useState<TypeCard[]>([]);
  const [start, setStart] = useState(0);
  const total = carTypes.length;
  const canPrev = start > 0;
  const canNext = start + VISIBLE < total;
  const scrollRef = useRef<HTMLDivElement>(null);

  const prev = () => setStart((s) => Math.max(0, s - 1));
  const next = () => setStart((s) => Math.min(total - VISIBLE, s + 1));
  const visible = carTypes.slice(start, start + VISIBLE);

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const response = await fetch("/api/vehicles/getList");
        const result = await response.json();
        if (!response.ok || !result.success || !Array.isArray(result.data)) {
          setCarTypes([]);
          return;
        }

        const map = new Map<string, TypeCard>();
        (result.data as VehicleItem[]).forEach((car) => {
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

        setCarTypes(
          Array.from(map.values()).sort((a, b) =>
            a.label.localeCompare(b.label),
          ),
        );
      } catch {
        setCarTypes([]);
      }
    };

    loadTypes();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof window === "undefined") return;
    if (window.innerWidth >= 768) return;

    const step = el.clientWidth * 0.9;
    let direction = 1;
    const interval = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      let next = el.scrollLeft + direction * step;
      if (next >= maxScroll) {
        next = maxScroll;
        direction = -1;
      } else if (next <= 0) {
        next = 0;
        direction = 1;
      }
      el.scrollTo({ left: next, behavior: "smooth" });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-background px-6 pt-0 pb-20 -mt-20">
      <div className="mx-auto max-w-7xl pt-32">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p
              className="text-sm font-bold tracking-widest uppercase mb-1 text-font"
            >
              Explore
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-light">
              Browse By Type
            </h2>
          </div>

          <div className="flex items-center gap-3 mt-1 shrink-0">
            <Link
              href="/inventory"
              className="text-sm font-semibold hover:underline hidden sm:block text-font"
            >
              See All Types →
            </Link>
            <div className="hidden md:flex gap-1">
              <button
                onClick={prev}
                disabled={!canPrev}
                className={`w-8 h-8 flex items-center justify-center border transition-all ${
                  canPrev
                    ? "border-gray-300 text-gray-600 hover:border-primary hover:text-primary"
                    : "border-gray-200 text-gray-300 cursor-not-allowed"
                }`}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                disabled={!canNext}
                className={`w-8 h-8 flex items-center justify-center border transition-all ${
                  canNext
                    ? "border-gray-300 text-gray-600 hover:border-primary hover:text-primary"
                    : "border-gray-200 text-gray-300 cursor-not-allowed"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-2 pb-6 touch-pan-x"
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
                  className="group relative snap-center shrink-0 min-w-[75vw] overflow-hidden cursor-pointer aspect-[4/3]"
                >
                  {type.image ? (
                    <Image
                      src={type.image}
                      alt={type.label}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-300" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/15 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                    <p className="text-white font-bold text-sm leading-tight">
                      {type.label}
                    </p>
                    <p className="text-white/70 text-xs mt-0.5">
                      {type.count} Cars
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-30" />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-0.5">
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
                  className="group relative overflow-hidden cursor-pointer aspect-[4/3]"
                >
                  {type.image ? (
                    <Image
                      src={type.image}
                      alt={type.label}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-300" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/15 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                    <p className="text-white font-bold text-sm leading-tight">
                      {type.label}
                    </p>
                    <p className="text-white/70 text-xs mt-0.5">
                      {type.count} Cars
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-30" />
                </motion.div>
              </Link>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-5 sm:hidden">
          <Link
            href="/inventory"
            className="text-sm font-semibold hover:underline text-font"
          >
            See All Types →
          </Link>
        </div>
      </div>
    </section>
  );
}
