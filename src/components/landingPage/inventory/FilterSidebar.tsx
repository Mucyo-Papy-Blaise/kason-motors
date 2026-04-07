"use client";

import {
  BADGE_OPTIONS,
  BODY_TYPE_OPTIONS,
  BRAND_OPTIONS,
  CONDITION_OPTIONS,
  DRIVE_TYPE_OPTIONS,
  FUEL_OPTIONS,
  TRANSMISSION_OPTIONS,
} from "@/components/dashboard/listings/vehicleFormOptions";
import { ChevronDown } from "lucide-react";
import React from "react";
import type { InventoryFilters } from "./Carlistingpage";

type FilterSidebarProps = {
  filters: InventoryFilters;
  maxPrice: number;
  onFiltersChange: (filters: InventoryFilters) => void;
};

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label }) => (
  <label className="group flex cursor-pointer items-center justify-between gap-2 py-0.5">
    <div className="flex items-center gap-2">
      <div
        onClick={() => onChange(!checked)}
        className={`h-4 w-4 shrink-0 rounded-sm border-[1.5px] transition-all duration-150 flex items-center justify-center ${
          checked ? "border-primary bg-primary" : "border-gray-300 group-hover:border-primary"
        }`}
      >
        {checked ? (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path
              d="M1 3.5L3.5 6L8 1"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </div>
      <span className={`text-[13px] transition-colors ${checked ? "font-medium text-gray-900" : "text-gray-500"}`}>
        {label}
      </span>
    </div>
  </label>
);

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  maxPrice,
  onFiltersChange,
}) => {
  const defaultFilters: InventoryFilters = React.useMemo(
    () => ({
      brands: [],
      fuels: [],
      bodyTypes: [],
      conditions: [],
      transmissions: [],
      driveTypes: [],
      badges: [],
      negotiable: "all",
      maxPrice,
    }),
    [maxPrice],
  );

  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({
    brand: true,
    fuel: true,
    bodyType: true,
    condition: false,
    transmission: false,
    driveType: false,
    badge: false,
    negotiable: true,
    price: true,
  });

  const toggleSection = (key: keyof typeof expanded) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFilter = (
    key: "brands" | "fuels" | "bodyTypes" | "conditions" | "transmissions" | "driveTypes" | "badges",
    value: string
  ) => {
    const current = filters[key];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [key]: next });
  };

  const clearFilterGroup = (
    key: "brands" | "fuels" | "bodyTypes" | "conditions" | "transmissions" | "driveTypes" | "badges",
  ) => {
    onFiltersChange({ ...filters, [key]: [] });
  };

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.fuels.length > 0 ||
    filters.bodyTypes.length > 0 ||
    filters.conditions.length > 0 ||
    filters.transmissions.length > 0 ||
    filters.driveTypes.length > 0 ||
    filters.badges.length > 0 ||
    filters.negotiable !== "all" ||
    filters.maxPrice < maxPrice;

  return (
    <>
      <style>{`
        .filter-sidebar-scroll::-webkit-scrollbar { width: 3px; }
        .filter-sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .filter-sidebar-scroll::-webkit-scrollbar-thumb { background: #E0E0E0; border-radius: 99px; }
        .filter-sidebar-scroll::-webkit-scrollbar-thumb:hover { background: #4CAF50; }
        .filter-sidebar-scroll { scrollbar-width: thin; scrollbar-color: #E0E0E0 transparent; }
      `}</style>
      <aside className="w-full lg:w-72 shrink-0">
        <div className="filter-sidebar-scroll max-h-[calc(100vh-120px)] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4">
          <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-gray-900">
            Filter by
          </h2>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => onFiltersChange(defaultFilters)}
              className="mb-4 text-xs font-bold uppercase tracking-wider text-primary hover:underline"
            >
              Clear all filters
            </button>
          ) : null}

          <div className="mb-5">
            <div className="mb-2.5 flex items-center justify-between">
              <button type="button" onClick={() => toggleSection("brand")} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Brand <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded.brand ? "rotate-180" : ""}`} />
              </button>
              {filters.brands.length > 0 ? (
                <button type="button" onClick={() => clearFilterGroup("brands")} className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline">
                  Clear
                </button>
              ) : null}
            </div>
            {expanded.brand ? (
              <div className="space-y-1">
                {BRAND_OPTIONS.map((brand) => (
                  <Checkbox
                    key={brand}
                    checked={filters.brands.includes(brand)}
                    onChange={() => toggleFilter("brands", brand)}
                    label={brand}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="mb-5">
            <div className="mb-2.5 flex items-center justify-between">
              <button type="button" onClick={() => toggleSection("fuel")} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Fuel Type <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded.fuel ? "rotate-180" : ""}`} />
              </button>
              {filters.fuels.length > 0 ? (
                <button type="button" onClick={() => clearFilterGroup("fuels")} className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline">
                  Clear
                </button>
              ) : null}
            </div>
            {expanded.fuel ? (
              <div className="space-y-1">
                {FUEL_OPTIONS.map((fuel) => (
                  <Checkbox
                    key={fuel}
                    checked={filters.fuels.includes(fuel)}
                    onChange={() => toggleFilter("fuels", fuel)}
                    label={fuel}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="mb-5">
            <div className="mb-2.5 flex items-center justify-between">
              <button type="button" onClick={() => toggleSection("bodyType")} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Body Type <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded.bodyType ? "rotate-180" : ""}`} />
              </button>
              {filters.bodyTypes.length > 0 ? (
                <button type="button" onClick={() => clearFilterGroup("bodyTypes")} className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline">
                  Clear
                </button>
              ) : null}
            </div>
            {expanded.bodyType ? (
              <div className="space-y-1">
                {BODY_TYPE_OPTIONS.map((bodyType) => (
                  <Checkbox
                    key={bodyType}
                    checked={filters.bodyTypes.includes(bodyType)}
                    onChange={() => toggleFilter("bodyTypes", bodyType)}
                    label={bodyType}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="mb-5">
            <div className="mb-2.5 flex items-center justify-between">
              <button type="button" onClick={() => toggleSection("condition")} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Condition <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded.condition ? "rotate-180" : ""}`} />
              </button>
              {filters.conditions.length > 0 ? (
                <button type="button" onClick={() => clearFilterGroup("conditions")} className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline">
                  Clear
                </button>
              ) : null}
            </div>
            {expanded.condition ? (
              <div className="space-y-1">
                {CONDITION_OPTIONS.map((condition) => (
                  <Checkbox
                    key={condition}
                    checked={filters.conditions.includes(condition)}
                    onChange={() => toggleFilter("conditions", condition)}
                    label={condition}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="mb-5">
            <div className="mb-2.5 flex items-center justify-between">
              <button type="button" onClick={() => toggleSection("transmission")} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Transmission <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded.transmission ? "rotate-180" : ""}`} />
              </button>
              {filters.transmissions.length > 0 ? (
                <button type="button" onClick={() => clearFilterGroup("transmissions")} className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline">
                  Clear
                </button>
              ) : null}
            </div>
            {expanded.transmission ? (
              <div className="space-y-1">
                {TRANSMISSION_OPTIONS.map((transmission) => (
                  <Checkbox
                    key={transmission}
                    checked={filters.transmissions.includes(transmission)}
                    onChange={() => toggleFilter("transmissions", transmission)}
                    label={transmission}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="mb-5">
            <div className="mb-2.5 flex items-center justify-between">
              <button type="button" onClick={() => toggleSection("driveType")} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Drive Type <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded.driveType ? "rotate-180" : ""}`} />
              </button>
              {filters.driveTypes.length > 0 ? (
                <button type="button" onClick={() => clearFilterGroup("driveTypes")} className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline">
                  Clear
                </button>
              ) : null}
            </div>
            {expanded.driveType ? (
              <div className="space-y-1">
                {DRIVE_TYPE_OPTIONS.map((driveType) => (
                  <Checkbox
                    key={driveType}
                    checked={filters.driveTypes.includes(driveType)}
                    onChange={() => toggleFilter("driveTypes", driveType)}
                    label={driveType}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="mb-5">
            <div className="mb-2.5 flex items-center justify-between">
              <button type="button" onClick={() => toggleSection("badge")} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Badge <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded.badge ? "rotate-180" : ""}`} />
              </button>
              {filters.badges.length > 0 ? (
                <button type="button" onClick={() => clearFilterGroup("badges")} className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline">
                  Clear
                </button>
              ) : null}
            </div>
            {expanded.badge ? (
              <div className="space-y-1">
                {BADGE_OPTIONS.map((badge) => (
                  <Checkbox
                    key={badge}
                    checked={filters.badges.includes(badge)}
                    onChange={() => toggleFilter("badges", badge)}
                    label={badge}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="mb-5">
            <div className="mb-2.5 flex items-center justify-between">
              <button type="button" onClick={() => toggleSection("negotiable")} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Negotiable <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded.negotiable ? "rotate-180" : ""}`} />
              </button>
              {filters.negotiable !== "all" ? (
                <button type="button" onClick={() => onFiltersChange({ ...filters, negotiable: "all" })} className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline">
                  Clear
                </button>
              ) : null}
            </div>
            {expanded.negotiable ? (
              <select
                value={filters.negotiable}
                onChange={(event) =>
                  onFiltersChange({
                    ...filters,
                    negotiable: event.target.value as InventoryFilters["negotiable"],
                  })
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="all">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            ) : null}
          </div>

          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <button type="button" onClick={() => toggleSection("price")} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Max Price <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded.price ? "rotate-180" : ""}`} />
              </button>
              {filters.maxPrice < maxPrice ? (
                <button type="button" onClick={() => onFiltersChange({ ...filters, maxPrice })} className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline">
                  Clear
                </button>
              ) : null}
            </div>
            {expanded.price ? (
              <>
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  value={filters.maxPrice}
                  onChange={(event) =>
                    onFiltersChange({
                      ...filters,
                      maxPrice: Number(event.target.value),
                    })
                  }
                  className="h-1.5 w-full cursor-pointer rounded-full accent-primary"
                />
                <p className="mt-1.5 text-[12px] text-gray-600">
                  max. <span className="font-bold text-gray-900">{filters.maxPrice.toLocaleString()} RWF</span>
                </p>
              </>
            ) : null}
          </div>
        </div>
      </aside>
    </>
  );
};
