"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import {
  readVehicleListCache,
  writeVehicleListCache,
} from "@/lib/vehiclesListCache";

type HeroSlide = {
  id: number;
  title: string;
  car: string;
  price: string;
  period: string;
  description: string;
  image: string;
};

type Vehicle = {
  id: number;
  title?: string;
  brand?: string;
  model?: string;
  year?: number | string;
  body_type?: string;
  fuel?: string;
  price?: number | string;
  image?: string;
  image_urls?: string[];
};

const fallbackSlides: HeroSlide[] = [
  {
    id: 1,
    title: "LIMITED EDITION",
    car: "PORSCHE CAYENNE",
    price: "625,000 RWF",
    period: "/ Month",
    description: "0 RWF first payment. Taxes, title and fees extra.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80",
  },
  {
    id: 2,
    title: "NEW ARRIVAL",
    car: "LAND CRUISER 2024",
    price: "850,000 RWF",
    period: "/ Month",
    description: "Premium SUV. Built for every terrain.",
    image:
      "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=1920&q=80",
  },
  {
    id: 3,
    title: "BEST SELLER",
    car: "BMW X5 M-SPORT",
    price: "720,000 RWF",
    period: "/ Month",
    description: "Performance meets luxury. Drive the difference.",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&q=80",
  },
];

function buildSlidesFromVehicles(data: Vehicle[]): HeroSlide[] {
  const sorted = [...data].sort(
    (a, b) => Number(b.id || 0) - Number(a.id || 0),
  );

  return sorted.slice(0, 4).map((car) => {
    const name =
      car.title ||
      `${car?.brand || ""} ${car?.model || ""} ${car?.year || ""}`.trim() ||
      "Featured Vehicle";

    const details = [car?.year, car?.body_type, car?.fuel]
      .filter(Boolean)
      .join(" · ");

    return {
      id: car.id,
      title: "NEW ARRIVAL", // consistent hero label
      car: name.toUpperCase(),
      price: `${Number(car?.price || 0).toLocaleString()} RWF`,
      period: "",
      description: details || "Recently added vehicle.",
      image: car?.image_urls?.[0] || car?.image || fallbackSlides[0].image,
    };
  });
}

export default function Hero() {
  const ref = useRef(null);
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const loadSlides = async () => {
      const cached = readVehicleListCache<Vehicle>();
      if (cached?.length) {
        const cachedSlides = buildSlidesFromVehicles(cached);
        setSlides(cachedSlides.length > 0 ? cachedSlides : fallbackSlides);
        setCurrent(0);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/vehicles/getList");
        const result = await response.json();
        if (!response.ok || !result.success || !Array.isArray(result.data)) {
          setSlides(fallbackSlides);
          return;
        }
        const vehicles = result.data as Vehicle[];
        writeVehicleListCache(vehicles);
        const liveSlides = buildSlidesFromVehicles(vehicles);

        if (liveSlides.length > 0) {
          setSlides(liveSlides);
          setCurrent(0);
          return;
        }

        // API succeeded but has no usable cars; keep a stable hero.
        setSlides(fallbackSlides);
      } catch {
        // Show fallback content only if we genuinely cannot fetch data.
        setSlides(fallbackSlides);
      } finally {
        setIsLoading(false);
      }
    };

    loadSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const slide = slides[current];

  if (isLoading) {
    return (
      <section
        ref={ref}
        className="relative h-screen min-h-[600px] overflow-hidden bg-black"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/80" />
        <div className="relative z-10 flex h-full flex-col justify-center px-4 pt-20 sm:px-6 md:px-12 lg:px-24">
          <div className="animate-pulse">
            <div className="mb-4 h-3 w-40 rounded bg-white/20" />
            <div className="mb-3 h-16 w-2/3 rounded bg-white/20 md:h-20" />
            <div className="mb-5 h-16 w-3/5 rounded bg-white/15 md:h-20" />
            <div className="mb-4 h-10 w-56 rounded bg-primary/30" />
            <div className="h-4 w-72 rounded bg-white/20" />
          </div>
          <div className="mt-8 flex gap-2 md:mt-10">
            {[0, 1, 2].map((dot) => (
              <div key={dot} className="h-1 w-6 rounded-full bg-white/25" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative h-screen min-h-[600px] overflow-hidden bg-black"
    >
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        {slides.map((item, index) => (
          <motion.div
            key={`${item.id}-${item.car}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === current ? 1 : 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              priority={index === 0}
              unoptimized
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/40 to-transparent" />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col justify-center px-4 pt-20 sm:px-6 md:px-12 lg:px-24"
      >
        <motion.div
          key={current}
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary-light">
            {slide?.title}
          </p>
          <h1 className="mb-4 text-3xl leading-none font-bold tracking-tight text-white md:text-3xl lg:text-5xl truncate">
            {slide?.car}
          </h1>
          <div className="mb-3 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary-light">
              {slide?.price}
            </span>
            <span className="text-lg text-white/70">{slide?.period}</span>
          </div>
          <p className="mb-8 max-w-sm text-sm text-white/60">
            {slide?.description}
          </p>
        </motion.div>

        <div className="mt-8 flex gap-2 md:mt-10">
          {slides.map((item, index) => (
            <button
              key={`${item.id}-${item.car}-dot`}
              onClick={() => setCurrent(index)}
              className={`h-1 rounded-full transition-all duration-500 ${
                index === current ? "w-8 bg-primary-light" : "w-3 bg-white/40"
              }`}
              aria-label={`Show ${item?.car}`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
