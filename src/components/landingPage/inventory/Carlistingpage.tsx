"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FilterSidebar } from "./FilterSidebar";
import { CarCard } from "./Carcard";
import { ResultsHeader } from "./ResultsHeader";
import Navbar from "../Navbar";

const INVENTORY_CACHE_KEY = "inventory-cars-cache-v1";
const INVENTORY_CACHE_TTL_MS = 5 * 60 * 1000;

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

type CachedInventoryPayload = {
  data: InventoryCar[];
  cachedAt: number;
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
    const readCache = () => {
      try {
        const raw = sessionStorage.getItem(INVENTORY_CACHE_KEY);
        if (!raw) {
          return null;
        }
        const parsed = JSON.parse(raw) as CachedInventoryPayload;
        const isFresh = Date.now() - parsed.cachedAt < INVENTORY_CACHE_TTL_MS;
        return isFresh ? parsed.data : null;
      } catch {
        return null;
      }
    };

    const writeCache = (nextCars: InventoryCar[]) => {
      try {
        const payload: CachedInventoryPayload = {
          data: nextCars,
          cachedAt: Date.now(),
        };
        sessionStorage.setItem(INVENTORY_CACHE_KEY, JSON.stringify(payload));
      } catch {
        // Ignore cache write errors.
      }
    };

    const fetchCars = async () => {
      try {
        const cached = readCache();
        if (cached) {
          setCars(cached);
          setIsLoading(false);
        }

        const response = await fetch("/api/vehicles/getList");
        const result = await response.json();
        if (response.ok && result.success && Array.isArray(result.data)) {
          setCars(result.data);
          writeCache(result.data);
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
    <main className="min-h-screen bg-gray-light">
      <Navbar />
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-6 lg:flex-row lg:items-start lg:gap-6 lg:px-6 lg:py-8">
        <FilterSidebar
          filters={filters}
          maxPrice={maxPriceFromData}
          onFiltersChange={setFilters}
        />

        <div className="flex-1 min-w-0">
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
              <p className="font-medium text-gray-600">Loading inventory...</p>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-gray-400"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <p className="text-gray-900 font-bold text-lg">No cars found</p>
              <p className="text-gray-500 text-sm mt-1">
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
