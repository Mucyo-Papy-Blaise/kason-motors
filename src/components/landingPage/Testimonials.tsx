// 📁 components/Testimonials.tsx

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  text: string;
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials");
        const data = await res.json();
        if (data.success) {
          setTestimonials(data.data ?? []);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Don't render the section at all if no testimonials
  if (!loading && testimonials.length === 0) return null;

  return (
    <section className="bg-background px-4 py-12 sm:px-6 sm:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <p
            className="text-sm font-bold tracking-widest uppercase mb-2 text-font"
          >
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-light">
            What Our Customers Say
          </h2>
        </div>

        {/* Skeleton while loading */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse"
              >
                <div className="space-y-2 mb-6">
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                  <div className="h-3 bg-gray-200 rounded w-4/6" />
                </div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-24" />
                  <div className="h-2 bg-gray-200 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col gap-4"
              >
                {/* Quote mark */}
                <span
                  className="text-4xl leading-none font-serif"
                  style={{ color: "var(--primary)" }}
                >
                  &ldquo;
                </span>

                {/* Testimonial text */}
                <p className="text-gray-600 text-sm leading-relaxed flex-1">
                  {t.text}
                </p>

                {/* Divider */}
                <div
                  className="w-10 h-0.5"
                  style={{ background: "var(--primary)" }}
                />

                {/* Author */}
                <div>
                  <p className="text-sm font-semibold text-primary-dark">
                    {t.name}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}