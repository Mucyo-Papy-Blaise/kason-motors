"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import {
  FilterSidebar,
  InventoryFiltersPanel,
  countActiveFilterGroups,
} from "./FilterSidebar";
import { CarCard } from "./Carcard";
import { ResultsHeader } from "./ResultsHeader";
import Navbar from "../Navbar";
import {
  readVehicleListCache,
  writeVehicleListCache,
} from "@/lib/vehiclesListCache";

export type InventoryCar = {
  id: number;
  title?: string;
  brand?: string;
  model?: string;
  condition?: string;
  body_type?: string;
  drive_type?: string;
  fuel?: string;
  transmission?: string;
  mileage?: number | string;
  year?: number | string;
  price?: number | string;
  image?: string;
  image_urls?: string[];
  negotiable?: boolean;
  badge?: string;
  name?: string;
  type?: string;
  category?: string;
};

export type InventoryFilters = {
  brands: string[];
  fuels: string[];
  bodyTypes: string[];
  conditions: string[];
  transmissions: string[];
  driveTypes: string[];
  badges: string[];
  negotiable: "all" | "yes" | "no";
  maxPrice: number;
};

export const CarListingPage: React.FC = () => {
  const searchParams = useSearchParams();
  const initialBodyType = searchParams.get("bodyType")?.trim() || "";
  const initialBrand = searchParams.get("brand")?.trim() || "";
  const initialCondition = searchParams.get("condition")?.trim() || "";
  const initialModel = searchParams.get("model")?.trim() || "";
  const initialYear = searchParams.get("year")?.trim() || "";
  const initialMaxYear = searchParams.get("maxYear")?.trim() || "";
  const initialMaxPrice = Number(searchParams.get("maxPrice") || "");
  const initialSearch = searchParams.get("q")?.trim() || "";
  const [cars, setCars] = useState<InventoryCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState("Newest");

  const maxPriceFromData = useMemo(
    () => Math.max(1000, ...cars.map((car) => Number(car.price || 0))),
    [cars]
  );

  const [filters, setFilters] = useState<InventoryFilters>({
    brands: [],
    fuels: [],
    bodyTypes: [],
    conditions: [],
    transmissions: [],
    driveTypes: [],
    badges: [],
    negotiable: "all",
    maxPrice: maxPriceFromData,
  });
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  useEffect(() => {
    if (
      !initialBodyType &&
      !initialBrand &&
      !initialCondition &&
      !initialMaxPrice
    ) {
      return;
    }
    setFilters((prev) => ({
      ...prev,
      bodyTypes: initialBodyType ? [initialBodyType] : prev.bodyTypes,
      brands: initialBrand ? [initialBrand] : prev.brands,
      conditions: initialCondition ? [initialCondition] : prev.conditions,
      maxPrice:
        Number.isFinite(initialMaxPrice) && initialMaxPrice > 0
          ? initialMaxPrice
          : prev.maxPrice,
    }));
  }, [initialBodyType, initialBrand, initialCondition, initialMaxPrice]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      // Ensure initial slider range does not lock out high-priced vehicles.
      maxPrice:
        prev.maxPrice > maxPriceFromData || prev.maxPrice === 0 || (cars.length > 0 && prev.maxPrice === 1000)
          ? maxPriceFromData
          : prev.maxPrice,
    }));
  }, [maxPriceFromData, cars.length]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const cached = readVehicleListCache<InventoryCar>();
        if (cached) {
          setCars(cached);
          setIsLoading(false);
        }

        const response = await fetch("/api/vehicles/getList");
        const result = await response.json();
        if (response.ok && result.success && Array.isArray(result.data)) {
          setCars(result.data);
          writeVehicleListCache(result.data);
        } else {
          setCars([]);
        }
      } catch {
        setCars([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    document.body.style.overflow = filterDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterDrawerOpen]);

  const activeFilterGroups = useMemo(
    () => countActiveFilterGroups(filters, maxPriceFromData),
    [filters, maxPriceFromData],
  );

  const filteredCars = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    const filtered = cars.filter((car) => {
      const brand = car.brand || car.category || "";
      const bodyType = car.body_type || car.type || "";
      const condition = car.condition || "";
      const transmission = car.transmission || "";
      const driveType = car.drive_type || "";
      const badge = car.badge || "";
      const model = car.model || "";
      const yearValue = Number(car.year || 0);
      const title =
        car.title || `${car.brand || ""} ${car.model || ""}`.trim() || car.name || "";

      if (filters.brands.length > 0 && !filters.brands.includes(brand)) {
        return false;
      }
      if (filters.fuels.length > 0 && !filters.fuels.includes(car.fuel || "")) {
        return false;
      }
      if (filters.bodyTypes.length > 0 && !filters.bodyTypes.includes(bodyType)) {
        return false;
      }
      if (filters.conditions.length > 0 && !filters.conditions.includes(condition)) {
        return false;
      }
      if (filters.transmissions.length > 0 && !filters.transmissions.includes(transmission)) {
        return false;
      }
      if (filters.driveTypes.length > 0 && !filters.driveTypes.includes(driveType)) {
        return false;
      }
      if (filters.badges.length > 0 && !filters.badges.includes(badge)) {
        return false;
      }
      if (filters.negotiable === "yes" && !car.negotiable) {
        return false;
      }
      if (filters.negotiable === "no" && car.negotiable) {
        return false;
      }
      if (Number(car.price || 0) > filters.maxPrice) {
        return false;
      }
      if (initialModel && model.toLowerCase() !== initialModel.toLowerCase()) {
        return false;
      }
      if (initialYear && String(car.year || "") !== initialYear) {
        return false;
      }
      if (initialMaxYear && yearValue > Number(initialMaxYear)) {
        return false;
      }
      if (searchTerm) {
        const haystack = `${title} ${brand} ${car.model || ""} ${bodyType} ${car.fuel || ""}`
          .concat(` ${condition} ${transmission} ${driveType} ${badge}`)
          .toLowerCase();
        if (!haystack.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });

    return filtered.sort((a, b) => {
      if (sort === "Price: Low to High") {
        return Number(a.price || 0) - Number(b.price || 0);
      }
      if (sort === "Price: High to Low") {
        return Number(b.price || 0) - Number(a.price || 0);
      }
      return Number(b.year || 0) - Number(a.year || 0);
    });
  }, [cars, filters, search, sort, initialMaxYear, initialModel, initialYear]);

  return (
    <main className="min-h-screen bg-bg text-font">
      <Navbar />
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-4 sm:py-6 lg:flex-row lg:items-start lg:gap-6 lg:px-6 lg:py-8">
        <div className="w-full lg:hidden">
          <button
            type="button"
            onClick={() => setFilterDrawerOpen(true)}
            className="flex min-h-[48px] w-full touch-manipulation items-center justify-center gap-2 rounded-xl border border-line/25 bg-gray-dark px-4 py-3 text-sm font-bold uppercase tracking-widest text-font shadow-sm transition-colors active:bg-ink"
          >
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            Filters
            {activeFilterGroups > 0 ? (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-black text-font">
                {activeFilterGroups}
              </span>
            ) : null}
          </button>
        </div>

        <FilterSidebar
          filters={filters}
          maxPrice={maxPriceFromData}
          onFiltersChange={setFilters}
        />

        <div className="min-w-0 flex-1">
          <ResultsHeader
            count={filteredCars.length}
            search={search}
            sort={sort}
            onSearchChange={setSearch}
            onSortChange={setSort}
          />
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 h-10 w-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
              <p className="font-medium text-gray-mid">Loading inventory...</p>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-dark flex items-center justify-center mb-4">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-gray-mid"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <p className="text-font font-bold text-lg">No cars found</p>
              <p className="text-gray-mid text-sm mt-1">
                Try adjusting your filters
              </p>
              <button
                onClick={() =>
                  setFilters({
                    brands: [],
                    fuels: [],
                    bodyTypes: [],
                    conditions: [],
                    transmissions: [],
                    driveTypes: [],
                    badges: [],
                    negotiable: "all",
                    maxPrice: maxPriceFromData,
                  })
                }
                className="mt-4 text-primary text-sm font-bold hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {filterDrawerOpen ? (
          <>
            <motion.div
              key="inventory-filters-backdrop"
              className="fixed inset-0 z-[100] bg-ink/75 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setFilterDrawerOpen(false)}
              aria-hidden
            />
            <motion.div
              key="inventory-filters-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="inventory-filter-drawer-title"
              className="fixed inset-y-0 left-0 z-[110] flex w-full max-w-md flex-col bg-bg shadow-2xl lg:hidden"
              initial={{ x: "-104%" }}
              animate={{ x: 0 }}
              exit={{ x: "-104%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
            >
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line/25 px-4 py-4">
                <h2
                  id="inventory-filter-drawer-title"
                  className="text-sm font-black uppercase tracking-widest text-font"
                >
                  Filters
                </h2>
                <button
                  type="button"
                  onClick={() => setFilterDrawerOpen(false)}
                  className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-xl text-font transition-colors hover:bg-gray-dark"
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
                <InventoryFiltersPanel
                  variant="drawer"
                  filters={filters}
                  maxPrice={maxPriceFromData}
                  onFiltersChange={setFilters}
                />
              </div>
              <div className="shrink-0 border-t border-line/25 bg-bg px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <button
                  type="button"
                  onClick={() => setFilterDrawerOpen(false)}
                  className="min-h-[48px] w-full touch-manipulation rounded-xl bg-primary py-3.5 text-sm font-bold uppercase tracking-widest text-font transition-colors hover:bg-primary-dark active:scale-[0.99]"
                >
                  Show results
                </button>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </main>
  );
};
