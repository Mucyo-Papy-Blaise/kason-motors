"use client";

import VehicleFormWizard from "@/components/dashboard/listings/VehicleFormWizard";
import { VehicleFormData } from "@/lib/vehicleFormSchema";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CARS_CACHE_KEY = "admin-cars-cache-v1";
const CARS_CACHE_TTL_MS = 5 * 60 * 1000;

type CachedCarsPayload = {
  data: Record<string, unknown>[];
  cachedAt: number;
};

export default function UploadPage() {
  const router = useRouter();

  const updateListingsCacheAfterCreate = (createdCar: Record<string, unknown>) => {
    try {
      const rawCache = sessionStorage.getItem(CARS_CACHE_KEY);
      const now = Date.now();
      if (!rawCache) {
        const payload: CachedCarsPayload = { data: [createdCar], cachedAt: now };
        sessionStorage.setItem(CARS_CACHE_KEY, JSON.stringify(payload));
        return;
      }

      const parsed = JSON.parse(rawCache) as CachedCarsPayload;
      const isFresh = now - parsed.cachedAt < CARS_CACHE_TTL_MS;
      const previousCars = Array.isArray(parsed.data) && isFresh ? parsed.data : [];
      const nextCars = [createdCar, ...previousCars.filter((car) => car.id !== createdCar.id)];
      const payload: CachedCarsPayload = { data: nextCars, cachedAt: now };
      sessionStorage.setItem(CARS_CACHE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore cache failures.
    }
  };

  const handleSubmit = async (payload: VehicleFormData) => {
    const response = await fetch("/api/vehicles/car", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to save vehicle");
    }
    if (result.data) {
      updateListingsCacheAfterCreate(result.data);
    }
    toast.success("Vehicle uploaded successfully");
    router.push("/admin/listings");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary/5 to-gray-100 flex items-start justify-center py-12 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Upload Vehicle</h1>
          <p className="text-sm text-gray-500">Add all listing details in a guided multi-step form.</p>
        </div>
        <VehicleFormWizard
          submitLabel="Upload Vehicle"
          loadingLabel="Uploading..."
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
