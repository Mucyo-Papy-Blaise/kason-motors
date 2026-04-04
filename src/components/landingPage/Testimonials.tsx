"use client";
import { motion } from "framer-motion";
import { testimonials } from "@/lib/mockData";

export default function Testimonials() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p
            className="text-sm font-bold tracking-widest uppercase mb-2"
            style={{ color: "var(--primary)" }}
          >
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="flex mb-3">
                {[...Array(t.rating)].map((_, j) => (
                  <span key={j} style={{ color: "var(--primary)" }}>
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                &quot;{t.text}&quot;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: "var(--primary)" }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {t.name}
                  </p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
