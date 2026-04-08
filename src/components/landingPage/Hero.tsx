"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";


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

export default function Hero() {
  const ref = useRef(null);
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<HeroSlide[]>(fallbackSlides);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const response = await fetch("/api/vehicles/getList");
        const result = await response.json();
        if (!response.ok || !result.success || !Array.isArray(result.data)) {
          return;
        }

        const byBrand = new Map<string, Vehicle>();
        const sorted = [...(result.data as Vehicle[])].sort(
          (a, b) => Number(b.id || 0) - Number(a.id || 0),
        );

        sorted.forEach((car) => {
          const brandKey = (car.brand || "").trim();
          if (!brandKey) return;
          if (!byBrand.has(brandKey)) {
            byBrand.set(brandKey, car);
          }
        });

        const liveSlides: HeroSlide[] = Array.from(byBrand.values())
          .slice(0, 8)
          .map((car) => {
            const brand = car.brand?.toUpperCase() || "FEATURED";
            const name =
              car.title ||
              `${car.brand || ""} ${car.model || ""} ${car.year || ""}`.trim() ||
              "Featured Vehicle";
            const details = [car.year, car.body_type, car.fuel]
              .filter(Boolean)
              .join(" · ");
            return {
              id: car.id,
              title: `${brand} COLLECTION`,
              car: name.toUpperCase(),
              price: `${Number(car.price || 0).toLocaleString()} RWF`,
              period: "",
              description: details || "Explore premium vehicles now available.",
              image: car.image_urls?.[0] || car.image || fallbackSlides[0].image,
            };
          });

        if (liveSlides.length > 0) {
          setSlides(liveSlides);
          setCurrent(0);
        }
      } catch {
        // Keep fallback slides on network or parsing errors.
      }
    };

    loadSlides();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const slide = slides[current];

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
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col justify-center px-8 pt-20 md:px-16 lg:px-32"
      >
        <motion.div
          key={current}
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary-light">
            {slide.title}
          </p>
          <h1 className="mb-4 text-5xl leading-none font-bold tracking-tight text-white md:text-7xl lg:text-8xl">
            {slide.car}
          </h1>
          <div className="mb-3 flex items-baseline gap-2">
            <span
              className="text-4xl font-bold text-primary-light"
            >
              {slide.price}
            </span>
            <span className="text-lg text-white/70">{slide.period}</span>
          </div>
          <p className="mb-8 max-w-sm text-sm text-white/60">
            {slide.description}
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
              aria-label={`Show ${item.car}`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
