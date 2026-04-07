"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import SearchModal from "./Searchmodal";

export default function SearchSection() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [carsCount, setCarsCount] = useState(0);
  const quickFilters = useMemo(
    () => ["All Conditions", "New Cars", "Used Cars", "Certified"],
    [],
  );

  useEffect(() => {
    const fetchCarsCount = async () => {
      try {
        const response = await fetch("/api/vehicles/getList");
        const result = await response.json();
        if (!response.ok || !result.success || !Array.isArray(result.data)) {
          setCarsCount(0);
          return;
        }
        setCarsCount(result.data.length);
      } catch {
        setCarsCount(0);
      }
    };
    fetchCarsCount();
  }, []);

  return (
    <>
      <section className="relative z-40 -mt-24 -mb-16 px-4 pb-0 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-5xl border border-black/5 bg-white shadow-2xl shadow-black/20">
          <div className="flex items-center justify-between px-6 pt-5 pb-0 sm:px-8">
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">
              Find Your Car
            </span>
            <span className="hidden text-[10px] font-black uppercase tracking-[0.15em] sm:block">
              <span className="text-primary">{carsCount}</span>
              <span className="text-gray-400"> cars available</span>
            </span>
          </div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex items-center gap-3 px-6 py-3 sm:px-8"
          >
            <div
              className="group flex flex-1 cursor-text items-center gap-3 border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:border-primary/40 focus-within:border-primary"
              onClick={() => setModalOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-focus-within:text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m1.6-5.4a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                readOnly
                placeholder="Search for cars, brands, models..."
                className="flex-1 cursor-pointer bg-transparent text-sm text-gray-700 caret-transparent placeholder:text-gray-400 focus:outline-none"
                onFocus={() => setModalOpen(true)}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setModalOpen(true)}
              className="shrink-0 whitespace-nowrap  bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-light sm:px-10"
            >
              Search
            </motion.button>
          </motion.div>

          <div className="flex flex-wrap items-center gap-1.5 px-6 pb-4 sm:px-8">
            {quickFilters.map((filter) => {
              const condition =
                filter === "New Cars"
                  ? "New"
                  : filter === "Used Cars"
                    ? "Used"
                    : filter === "Certified"
                      ? "Certified"
                      : "";
              return (
                <button
                  key={filter}
                  onClick={() => {
                    if (!condition) {
                      router.push("/inventory");
                      return;
                    }
                    router.push(`/inventory?condition=${encodeURIComponent(condition)}`);
                  }}
                  className=" bg-gray-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-500 transition-all duration-200 hover:bg-primary hover:text-white"
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <SearchModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
