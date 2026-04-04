"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  MapPin,
  Car,
  DollarSign,
  Gauge,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const filters = ["All Conditions", "New Cars", "Used Cars", "Certified"];

const makes = [
  "All Makes",
  "Toyota",
  "BMW",
  "Mercedes-Benz",
  "Porsche",
  "Land Rover",
  "Audi",
  "Lexus",
  "Ford",
  "Honda",
];
const models: Record<string, string[]> = {
  "All Makes": ["All Models"],
  Toyota: ["All Models", "Land Cruiser", "Camry", "RAV4", "Hilux", "Prado"],
  BMW: ["All Models", "X5", "X3", "3 Series", "5 Series", "M4"],
  "Mercedes-Benz": [
    "All Models",
    "GLE",
    "C-Class",
    "E-Class",
    "GLC",
    "S-Class",
  ],
  Porsche: ["All Models", "Cayenne", "Macan", "Panamera", "911", "Taycan"],
  "Land Rover": [
    "All Models",
    "Defender",
    "Discovery",
    "Range Rover",
    "Freelander",
  ],
  Audi: ["All Models", "Q7", "Q5", "A4", "A6", "RS6"],
  Lexus: ["All Models", "LX", "RX", "NX", "IS", "GX"],
  Ford: ["All Models", "Explorer", "Ranger", "Mustang", "F-150"],
  Honda: ["All Models", "CR-V", "Accord", "Civic", "Pilot"],
};
const priceRanges = [
  "All Prices",
  "Under $300/mo",
  "$300–$500/mo",
  "$500–$800/mo",
  "$800–$1200/mo",
  "Above $1200/mo",
];
const locations = [
  "All Locations",
  "Kigali",
  "Nairobi",
  "Kampala",
  "Dar es Salaam",
  "Mombasa",
];
const years = [
  "All Years",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "2019 & older",
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface SearchState {
  filter: string;
  make: string;
  model: string;
  price: string;
  location: string;
  year: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialField?: string;
  onSearch?: (state: SearchState) => void;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SelectField({
  label,
  icon: Icon,
  value,
  options,
  onChange,
  active,
  onFocus,
}: {
  label: string;
  icon: React.ElementType;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  active: boolean;
  onFocus: () => void;
}) {
  return (
    <div
      className={`relative flex flex-col gap-1.5 p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group ${
        active
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-gray-100 hover:border-gray-200 bg-gray-50/60"
      }`}
      onClick={onFocus}
    >
      <div className="flex items-center gap-2">
        <Icon
          size={13}
          className={`shrink-0 transition-colors ${active ? "text-primary" : "text-gray-400"}`}
        />
        <span
          className={`text-[10px] font-black tracking-[0.18em] uppercase transition-colors ${
            active ? "text-primary" : "text-gray-400"
          }`}
        >
          {label}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          className="w-full bg-transparent text-sm font-semibold text-gray-800 appearance-none cursor-pointer focus:outline-none pr-4"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className={`shrink-0 transition-all ${active ? "text-primary rotate-180" : "text-gray-300"}`}
        />
      </div>
      {/* Active accent bar */}
      {active && (
        <motion.div
          layoutId="fieldAccent"
          className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full"
        />
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SearchModal({
  isOpen,
  onClose,
  initialField,
  onSearch,
}: SearchModalProps) {
  const [search, setSearch] = useState<SearchState>({
    filter: "All Conditions",
    make: "All Makes",
    model: "All Models",
    price: "All Prices",
    location: "All Locations",
    year: "All Years",
  });
  const [activeField, setActiveField] = useState<string>(
    initialField ?? "make",
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleReset = () => {
    setSearch({
      filter: "All Conditions",
      make: "All Makes",
      model: "All Models",
      price: "All Prices",
      location: "All Locations",
      year: "All Years",
    });
    setShowAdvanced(false);
  };

  const handleSearch = () => {
    onSearch?.(search);
    onClose();
  };

  const availableModels = models[search.make] ?? ["All Models"];

  // Count active filters
  const activeCount = [
    search.make !== "All Makes",
    search.model !== "All Models",
    search.price !== "All Prices",
    search.location !== "All Locations",
    search.filter !== "All Conditions",
    search.year !== "All Years",
  ].filter(Boolean).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
          />

          {/* ── Modal Panel ──
               Mobile  → full-width sheet from bottom
               Desktop → centered card                 */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="
              fixed z-[90] bg-white shadow-2xl overflow-hidden
              /* Mobile: bottom sheet */
              bottom-0 left-0 right-0 rounded-t-3xl
              /* Desktop: centered modal */
              md:bottom-auto md:top-1/2 md:left-1/2
              md:-translate-x-1/2 md:-translate-y-1/2
              md:w-full md:max-w-3xl md:rounded-2xl
            "
          >
            {/* ── Drag handle (mobile only) ── */}
            <div className="md:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8  bg-primary/10 flex items-center justify-center">
                  <Search size={15} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-gray-900 tracking-tight">
                    Find Your Car
                  </h2>
                  <p className="text-xs text-gray-400 font-medium">
                    {activeCount > 0
                      ? `${activeCount} filter${activeCount > 1 ? "s" : ""} applied`
                      : "128 cars available"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X size={15} className="text-gray-600" />
              </button>
            </div>

            {/* ── Filter Tabs ── */}
            <div className="px-5 sm:px-7 pt-4 pb-2">
              <p className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase mb-2.5">
                I&apos;m Looking For
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSearch((p) => ({ ...p, filter: f }))}
                    className={`relative px-3 py-1.5 text-[11px] font-bold tracking-wide uppercase transition-all duration-200 ${
                      search.filter === f
                        ? "text-white bg-primary shadow-md shadow-primary/25"
                        : "text-gray-500 bg-gray-100 hover:bg-gray-200 hover:text-gray-800"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Fields ── */}
            <div className="px-5 sm:px-7 py-4 max-h-[52vh] md:max-h-none overflow-y-auto">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <SelectField
                  label="Make"
                  icon={Car}
                  value={search.make}
                  options={makes}
                  onChange={(v) =>
                    setSearch((p) => ({ ...p, make: v, model: "All Models" }))
                  }
                  active={activeField === "make"}
                  onFocus={() => setActiveField("make")}
                />
                <SelectField
                  label="Model"
                  icon={Gauge}
                  value={search.model}
                  options={availableModels}
                  onChange={(v) => setSearch((p) => ({ ...p, model: v }))}
                  active={activeField === "model"}
                  onFocus={() => setActiveField("model")}
                />
                <SelectField
                  label="Price"
                  icon={DollarSign}
                  value={search.price}
                  options={priceRanges}
                  onChange={(v) => setSearch((p) => ({ ...p, price: v }))}
                  active={activeField === "price"}
                  onFocus={() => setActiveField("price")}
                />
                <SelectField
                  label="Location"
                  icon={MapPin}
                  value={search.location}
                  options={locations}
                  onChange={(v) => setSearch((p) => ({ ...p, location: v }))}
                  active={activeField === "location"}
                  onFocus={() => setActiveField("location")}
                />
              </div>

              {/* Advanced toggle */}
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-2.5">
                      <SelectField
                        label="Year"
                        icon={Car}
                        value={search.year}
                        options={years}
                        onChange={(v) => setSearch((p) => ({ ...p, year: v }))}
                        active={activeField === "year"}
                        onFocus={() => setActiveField("year")}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Footer ── */}
            <div className="px-5 sm:px-7 py-4 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAdvanced((p) => !p)}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary uppercase tracking-widest transition-colors"
                >
                  <SlidersHorizontal size={13} />
                  <span>{showAdvanced ? "Less" : "Advanced"}</span>
                </button>
                {activeCount > 0 && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                  >
                    <RotateCcw size={12} />
                    Reset
                  </button>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSearch}
                className="flex items-center gap-2 px-7 py-3 bg-primary text-white font-bold rounded-xl text-sm uppercase tracking-widest shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow"
              >
                <Search size={15} />
                Search Cars
                {activeCount > 0 && (
                  <span className="ml-1 bg-white/20 text-white text-[10px] font-black rounded-full px-1.5 py-0.5">
                    {activeCount}
                  </span>
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
