"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ShieldCheck,
  CreditCard,
  Headphones,
  Sparkles,
} from "lucide-react";
import { stats } from "@/lib/mockData";

const heroBackground =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Certified Quality",
    desc: "Every car is verified through a 150-point inspection before listing.",
  },
  {
    icon: CreditCard,
    title: "Flexible Financing",
    desc: "Payment plans that bend to your budget without sacrificing choice.",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    desc: "Dedicated specialists are on call day or night to guide you.",
  },
  {
    icon: Sparkles,
    title: "Hassle-free Returns",
    desc: "Not satisfied? Return within seven days with no hidden fees.",
  },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="relative w-full overflow-hidden px-4 py-12 sm:px-6 sm:py-20" ref={ref}>
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/65" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-8 text-white sm:space-y-12">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="text-center"
            >
              <p className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</p>
              <p className="text-sm uppercase tracking-[0.4em] text-white/70">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-7 lg:flex-row lg:gap-10"
        >
          <div className="lg:w-1/3 space-y-4">
            <p
              className="text-xs font-black tracking-[0.4em] uppercase text-white/70"
              style={{ color: "var(--accent)" }}
            >
              Why Us
            </p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Why Choose Kason Motors?
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              Rwanda’s most trusted dealer blends live expertise with transparent
              processes so you can shop with confidence.
            </p>
          </div>

          <div className="lg:w-2/3 grid gap-6 md:grid-cols-2">
            {reasons.map((reason, i) => {
              const Icon = reason.icon;
              return (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  className="relative overflow-hidden border border-white/20 bg-white/5 p-6"
                >
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center bg-white/10 text-white shadow-lg shadow-black/30">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{reason.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {reason.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
