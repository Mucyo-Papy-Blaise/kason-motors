"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { InventoryCar } from "./Carlistingpage";

interface CarCardProps {
  car: InventoryCar;
}

const ZapIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L4.09 12.96A1 1 0 005 14.5h6.5L11 22l8.91-10.96A1 1 0 0019 9.5h-6.5L13 2z" />
  </svg>
);

const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const imageUrl = car.image_urls?.[0] || car.image || "";
  const title = car.title || `${car.brand} ${car.model}`.trim() || car.name;
  const bodyType = car.body_type || car.type || "-";
  const price = Number(car.price || 0);

  const DEFAULT_BADGES = ["", ""];
  const showBadge =
    car.badge && !DEFAULT_BADGES.includes(car.badge.toLowerCase().trim());

  const showFullOption = car.full_option === true;

  return (
    <Link href={`/inventory/${car.id}`} className="block h-full">
      <article
        className="
        group relative flex h-full flex-col overflow-hidden bg-gray-dark
        border border-line/25
        transition-all duration-300 ease-out
        hover:shadow-lg hover:shadow-black/30
        hover:-translate-y-1
        hover:border-primary/40
      "
      >
        <div className="relative h-44 shrink-0 overflow-hidden bg-ink">
          {/* Left badge — e.g. "New Arrival", "Hot Deal" */}
          {showBadge ? (
            <div className="absolute top-3 left-3 z-10">
              <div className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-font">
                {car.badge}
              </div>
            </div>
          ) : null}

          {/* Right badge — condition: New, Used, Foreign Used, etc. */}
          {car.condition ? (
            <div className="absolute top-3 right-3 z-10">
              <div className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-font">
                {car.condition}
              </div>
            </div>
          ) : null}

          <div className="w-full h-full relative transition-transform duration-500 group-hover:scale-105">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title ?? ""}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-font/80">
                No image
              </div>
            )}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col p-4">
          <div className="shrink-0">
            <p className="mb-0.5 text-[11px] font-semibold tracking-widest uppercase text-primary">
              {bodyType}
            </p>

            {/* Car title row with Full Option badge on the right */}
            <div className="flex items-start justify-between gap-2 min-h-[2.75rem]">
              <h3 className="line-clamp-2 text-base font-bold leading-snug text-font">
                {title}
              </h3>

              {/* Full Option — right side, white text */}
              {showFullOption ? (
                <span className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-white whitespace-nowrap mt-0.5">
                 
                  Full Option
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-3 flex min-h-0 flex-1 flex-col space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-font/85">
              Specs
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-font/90">
              <span className="flex items-center gap-1">{car.year || "-"}</span>
              <span className="flex items-center gap-1">{car.fuel || "-"}</span>
              <span className="flex items-center gap-1">{car.transmission || "-"}</span>
              <span className="flex items-center gap-1">
                {Number(car.mileage || 0).toLocaleString()} km
              </span>
              {car.drive_type ? (
                <span className="flex items-center gap-1 text-primary">
                  <ZapIcon />
                  {car.drive_type}
                </span>
              ) : null}
              {car.range ? (
                <span className="flex items-center gap-1 text-primary">
                  <ZapIcon />
                  {Number(car.range).toLocaleString()} km range
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-auto flex shrink-0 items-center justify-between gap-2 border-t border-line/20 pt-3">
            <div className="flex min-w-0 flex-col">
              <span className="text-xl font-black text-font">
                {price.toLocaleString()} RWF
              </span>
              <span className="ml-1 text-[11px] text-font/85">
                {car.negotiable ? "(Negotiable)" : ""}
              </span>
            </div>
            <span
              className="
              bg-primary text-font
              text-[12px] font-bold tracking-wide
              transition-all duration-200
              hover:bg-primary-dark
              hover:shadow-lg
              p-2
              rounded
              active:scale-95
            "
            >
              View details
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};