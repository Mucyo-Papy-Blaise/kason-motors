"use client";

import VehicleFormWizard from "@/components/dashboard/listings/VehicleFormWizard";
import { VehicleFormData } from "@/lib/vehicleFormSchema";
import { normalizeCarImages } from "@/types/car";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type EditPageProps = {
  params: Promise<{ id: string }>;
};

const CARS_CACHE_KEY = "admin-cars-cache-v1";
const CARS_CACHE_TTL_MS = 5 * 60 * 1000;

type CachedCarsPayload = {
  data: Record<string, unknown>[];
  cachedAt: number;
};

export default function EditVehiclePage({ params }: EditPageProps) {
  const router = useRouter();
  const [carId, setCarId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<VehicleFormData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { id } = await params;
        const numericId = Number(id);
        setCarId(numericId);
        const response = await fetch(`/api/vehicles/getById/${numericId}`);
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load vehicle");
        }
        const car = result.data;
        const images = normalizeCarImages(car.image, car.image_urls);
        setInitialData({
          title: car.title ?? "",
          brand: car.brand ?? "",
          model: car.model ?? "",
          year: String(car.year ?? ""),
          condition: car.condition ?? "",
          bodyType: car.body_type ?? "",
          mileage: String(car.mileage ?? ""),
          engineSize: car.engine_size ?? "",
          fuel: car.fuel ?? "",
          transmission: car.transmission ?? "",
          driveType: car.drive_type ?? "",
          horsepower: String(car.horsepower ?? ""),
          exteriorColor: car.exterior_color ?? "",
          interiorColor: car.interior_color ?? "",
          doors: car.doors ? String(car.doors) : "",
          seats: car.seats ? String(car.seats) : "",
          price: String(car.price ?? ""),
          negotiable: Boolean(car.negotiable),
          description: car.description ?? "",
          videoUrl: car.video_url ?? "",
          features: Array.isArray(car.features) ? car.features : [],
          image: images[0] ?? "",
          imageUrls: images,
          badge: car.badge ?? "",
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load vehicle");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [params]);

  const canRenderForm = useMemo(() => Boolean(initialData && carId), [initialData, carId]);

  const updateListingsCacheAfterUpdate = (id: number, payload: VehicleFormData) => {
    try {
      const rawCache = sessionStorage.getItem(CARS_CACHE_KEY);
      if (!rawCache) {
        return;
      }
      const parsed = JSON.parse(rawCache) as CachedCarsPayload;
      const isFresh = Date.now() - parsed.cachedAt < CARS_CACHE_TTL_MS;
      if (!isFresh || !Array.isArray(parsed.data)) {
        return;
      }

      const nextCars = parsed.data.map((car) =>
        Number(car.id) === id
          ? {
              ...car,
              title: payload.title,
              brand: payload.brand,
              model: payload.model,
              year: Number(payload.year),
              condition: payload.condition,
              body_type: payload.bodyType,
              mileage: Number(payload.mileage.replace(/,/g, "")),
              engine_size: payload.engineSize,
              fuel: payload.fuel,
              transmission: payload.transmission,
              drive_type: payload.driveType,
              horsepower: payload.horsepower ? Number(payload.horsepower) : null,
              exterior_color: payload.exteriorColor || null,
              interior_color: payload.interiorColor || null,
              doors: payload.doors ? Number(payload.doors) : null,
              seats: payload.seats ? Number(payload.seats) : null,
              price: Number(payload.price),
              negotiable: payload.negotiable,
              description: payload.description,
              image: payload.image,
              image_urls: payload.imageUrls,
              video_url: payload.videoUrl || null,
              features: payload.features ?? [],
              badge: payload.badge || null,
              name: payload.title,
              category: payload.brand,
              type: payload.bodyType,
            }
          : car
      );

      const cachePayload: CachedCarsPayload = {
        data: nextCars,
        cachedAt: Date.now(),
      };
      sessionStorage.setItem(CARS_CACHE_KEY, JSON.stringify(cachePayload));
    } catch {
      // Ignore cache failures.
    }
  };

  const handleSubmit = async (payload: VehicleFormData) => {
    if (!carId) {
      throw new Error("Missing vehicle id");
    }
    const response = await fetch(`/api/vehicles/update/${carId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update vehicle");
    }
    updateListingsCacheAfterUpdate(carId, payload);
    toast.success("Vehicle updated successfully");
    router.push("/admin/listings");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary/5 to-gray-100 flex items-start justify-center py-12 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Vehicle</h1>
          <p className="text-sm text-gray-500">Update listing details in a full page editor.</p>
        </div>
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading vehicle...</p>
        ) : canRenderForm ? (
          <VehicleFormWizard
            initialData={initialData ?? undefined}
            submitLabel="Save Changes"
            loadingLabel="Saving..."
            onSubmit={handleSubmit}
          />
        ) : (
          <p className="text-sm text-red-500">Vehicle not found.</p>
        )}
      </div>
    </div>
  );
}
