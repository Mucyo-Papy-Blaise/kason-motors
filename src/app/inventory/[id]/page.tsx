"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/landingPage/Navbar";
import Footer from "@/components/landingPage/Footer";

type CarDetails = {
  id: number;
  name?: string;
  title?: string;
  category?: string;
  type?: string;
  price?: number;
  year?: number;
  mileage?: number;
  fuel?: string;
  transmission?: string;
  image?: string;
  badge?: string;
  brand?: string;
  model?: string;
  condition?: string;
  body_type?: string;
  engine_size?: string;
  drive_type?: string;
  horsepower?: number | null;
  exterior_color?: string | null;
  interior_color?: string | null;
  doors?: number | null;
  seats?: number | null;
  negotiable?: boolean;
  description?: string;
  image_urls?: string[];
  video_url?: string | null;
  features?: string[];
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0,
  }).format(price);
}

const statIcons: Record<string, string> = {
  mileage: "M12 2a10 10 0 100 20A10 10 0 0012 2zm0 4v6l4 2",
  fuel: "M3 3h18v4H3zM5 7v14h14V7",
  transmission: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  year: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  engine: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  drive: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
};

export default function CarDetailPage() {
  const params = useParams<{ id: string }>();
  const [car, setCar] = useState<CarDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    const loadCar = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/vehicles/getById/${params.id}`);
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load car");
        }
        setCar(result.data);
      } catch (loadError) {
        setError(
          loadError instanceof Error ? loadError.message : "Failed to load car",
        );
      } finally {
        setIsLoading(false);
      }
    };
    if (params?.id) {
      loadCar();
    }
  }, [params?.id]);

  const carTitle = car?.title || car?.name || "Vehicle details";
  const imageUrls = useMemo(() => {
    if (!car) return [];
    if (Array.isArray(car.image_urls) && car.image_urls.length > 0)
      return car.image_urls;
    return car.image ? [car.image] : [];
  }, [car]);

  const specs = [
    { label: "Year", value: car?.year ?? "-", icon: "year" },
    {
      label: "Mileage",
      value: `${Number(car?.mileage || 0).toLocaleString()} km`,
      icon: "mileage",
    },
    { label: "Fuel", value: car?.fuel ?? "-", icon: "fuel" },
    {
      label: "Transmission",
      value: car?.transmission ?? "-",
      icon: "transmission",
    },
    { label: "Engine", value: car?.engine_size ?? "-", icon: "engine" },
    { label: "Drive", value: car?.drive_type ?? "-", icon: "drive" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-3 text-font">
        <p className="text-primary">{error || "Vehicle not found"}</p>
        <Link
          href="/inventory"
          className="text-primary font-semibold hover:underline"
        >
          Back to inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg font-sans text-font">
      <Navbar />
      <div className="bg-gray-dark border-b border-line/25 px-6 md:px-32 py-3 text-sm text-gray-mid">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span className="mx-2 text-gray-mid">/</span>
        <Link
          href="/inventory"
          className="hover:text-primary transition-colors"
        >
          Cars
        </Link>
        <span className="mx-2 text-gray-mid">/</span>
        <span className="text-font font-medium">{carTitle}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {car.badge ? (
                  <span className="inline-block bg-accent text-primary-dark text-xs font-bold uppercase tracking-widest px-3 py-1 rounded">
                    {car.badge}
                  </span>
                ) : null}
                {car.condition ? (
                  <span className="text-xs text-gray-mid border border-line rounded px-3 py-1">
                    {car.condition}
                  </span>
                ) : null}
                {car.negotiable ? (
                  <span className="text-xs text-primary-dark bg-primary/10 rounded px-3 py-1">
                    Negotiable
                  </span>
                ) : null}
              </div>
              <h1 className="text-3xl font-bold text-font tracking-tight">
                {carTitle}
              </h1>
              <p className="text-gray-mid mt-1">
                {car.brand} · {car.model} · {car.body_type || car.type}
              </p>
            </div>

            <div className="relative bg-gray-dark overflow-hidden border border-line/25 shadow-sm aspect-[16/9]">
              {imageUrls[activeImage] ? (
                <Image
                  src={imageUrls[activeImage]}
                  alt={carTitle}
                  fill
                  unoptimized
                  className="object-cover transition-opacity duration-300"
                />
              ) : null}
            </div>

            {imageUrls.length > 1 ? (
              <div className="flex gap-3">
                {imageUrls.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-14 overflow-hidden border-2 transition-all duration-200 ${
                      activeImage === i
                        ? "border-primary shadow-md scale-105"
                        : "border-line hover:border-primary-light"
                    }`}
                  >
                    <Image
                      src={url}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="bg-gray-dark border border-line/25 px-4 py-3 flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={statIcons[spec.icon]}
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-mid leading-none mb-0.5">
                      {spec.label}
                    </p>
                    <p className="text-sm font-semibold text-font">
                      {spec.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-6 space-y-4">
              <div className="bg-gray-dark border border-line/25 p-6">
                <h2 className="text-lg font-bold text-font mb-3">
                  About this Car
                </h2>
                <p className="text-gray-mid leading-relaxed text-sm">
                  {car.description || "-"}
                </p>
              </div>
              <div className="bg-gray-dark border border-line/25 p-6 shadow-sm">
                <p className="text-xs text-gray-mid uppercase tracking-widest mb-1">
                  Listed Price
                </p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(Number(car.price || 0))}
                  </span>
                </div>
                <div className="space-y-3 mt-4">
                  <button className="w-full bg-primary hover:bg-primary-dark text-font font-semibold py-2 transition-colors duration-200 text-sm tracking-wide">
                    Contact Seller
                  </button>
                </div>

                {inquiryOpen ? (
                  <div className="mt-4 space-y-3">
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full border border-line/30 bg-bg px-3 py-2.5 text-sm text-font placeholder:text-gray-mid"
                    />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      className="w-full border border-line/30 bg-bg px-3 py-2.5 text-sm text-font placeholder:text-gray-mid"
                    />
                    <textarea
                      rows={3}
                      placeholder="Your message…"
                      className="w-full border border-line/30 bg-bg px-3 py-2.5 text-sm text-font placeholder:text-gray-mid resize-none"
                    />
                    <button className="w-full bg-accent text-primary-dark font-semibold py-2.5 text-sm">
                      Submit Inquiry
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
