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

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const imageUrl = car.image_urls?.[0] || car.image || "";
  const title = car.title || `${car.brand} ${car.model}`.trim() || car.name;
  const bodyType = car.body_type || car.type || "-";
  const price = Number(car.price || 0);

  return (
    <Link href={`/inventory/${car.id}`} className="block">
    <article
      className="
      group relative overflow-hidden  bg-white
      border border-gray-200
      transition-all duration-300 ease-out
      hover:shadow
      hover:-translate-y-1
      hover:border-primary/40
    "
    >
      <div className="relative h-44 overflow-hidden bg-gray-100">
        {car.badge ? (
          <div className="absolute top-3 left-3 z-10">
            <div className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
              {car.badge}
            </div>
          </div>
        ) : null}
        <div className="w-full h-full relative transition-transform duration-500 group-hover:scale-105">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title ?? ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <p className="mb-0.5 text-[11px] font-semibold tracking-widest uppercase text-primary">
              {bodyType}
            </p>
            <h3 className="text-base font-bold leading-tight text-gray-900">
              {title}
            </h3>
          </div>
        </div>

        <div className="mt-3 mb-4 space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Specs</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <span className="flex items-center gap-1 text-[12px] text-gray-600">
              {car.year || "-"}
            </span>
            <span className="flex items-center gap-1 text-[12px] text-gray-600">
              {car.fuel || "-"}
            </span>
            <span className="flex items-center gap-1 text-[12px] text-gray-600">
              {car.transmission || "-"}
            </span>
            <span className="flex items-center gap-1 text-[12px] text-gray-600">
              {(Number(car.mileage || 0)).toLocaleString()} km
            </span>
            {car.drive_type ? (
              <span className="flex items-center gap-1 text-[12px] text-primary">
                <ZapIcon />
                {car.drive_type}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex flex-col">
            <span className="text-xl font-black text-gray-900">
              {price.toLocaleString()} RWF
            </span>
            <span className="ml-1 text-[11px] text-gray-500">
              {car.negotiable ? "(Negotiable)" : ""}
            </span>
          </div>
          <span
            className="
            bg-primary text-white
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
