"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { testimonials } from "@/lib/mockData";

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof window === "undefined") return;
    if (window.innerWidth >= 768) return;
    if (testimonials.length === 0) return;

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
  }, []);

  return (
    <section className="bg-background px-4 py-12 sm:px-6 sm:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center sm:mb-12">
          <p
            className="text-sm font-bold tracking-widest uppercase mb-2 text-font"
          >
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-light">
            What Our Customers Say
          </h2>
        </div>

        <div className="md:hidden">
          <div
            ref={scrollRef}
            className="flex touch-pan-x gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {testimonials.map((t, i) => (
              <div
                key={`${t.id}-mobile`}
                className="w-[min(88vw,22rem)] shrink-0 snap-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.35 }}
                  className="border border-gray-100/10 p-6 shadow-sm transition-all"
                >
                  <div className="mb-3 flex">
                    {[...Array(t.rating)].map((_, j) => (
                      <span key={j} className="text-font">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="mb-5 text-sm leading-relaxed text-gray-light/70">
                    &quot;{t.text}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-font/70">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary-dark">
                        {t.name}
                      </p>
                      <p className="text-xs text-gray-300">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden grid-cols-1 gap-4 sm:gap-6 md:grid md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="border border-gray-100/10 p-6 shadow-sm transition-all hover:shadow-lg"
            >
              <div className="mb-3 flex">
                {[...Array(t.rating)].map((_, j) => (
                  <span key={j} className="text-font">
                    ★
                  </span>
                ))}
              </div>
              <p className="mb-5 text-sm leading-relaxed text-gray-light/70">
                &quot;{t.text}&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-font/70">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-dark">
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-300">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
