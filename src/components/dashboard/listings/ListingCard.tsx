"use client";

import Image from "next/image";
import Link from "next/link";
import { Car, normalizeCarImages } from "@/types/car";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CARS_CACHE_KEY = "admin-cars-cache-v1";
const CARS_CACHE_TTL_MS = 5 * 60 * 1000;

type CachedCarsPayload = {
  data: Car[];
  cachedAt: number;
};

export default function VehicleList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const readCachedCars = () => {
      try {
        const rawCache = sessionStorage.getItem(CARS_CACHE_KEY);
        if (!rawCache) {
          return null;
        }
        const parsed = JSON.parse(rawCache) as CachedCarsPayload;
        const isFresh = Date.now() - parsed.cachedAt < CARS_CACHE_TTL_MS;
        if (!isFresh) {
          return null;
        }
        return parsed.data;
      } catch {
        return null;
      }
    };

    const writeCachedCars = (nextCars: Car[]) => {
      try {
        const payload: CachedCarsPayload = {
          data: nextCars,
          cachedAt: Date.now(),
        };
        sessionStorage.setItem(CARS_CACHE_KEY, JSON.stringify(payload));
      } catch {
        // Ignore cache write failures.
      }
    };

    const fetchCars = async () => {
      try {
        const cachedCars = readCachedCars();
        if (cachedCars) {
          setCars(cachedCars);
          setIsLoading(false);
          return;
        }

        const response = await fetch("/api/vehicles/getList");
        const result = await response.json();

        if (result.success) {
          setCars(result.data);
          writeCachedCars(result.data);
          setIsLoading(false);
          return;
        }

        console.log(result.message);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/vehicles/delete/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        toast.error(`Delete failed: ${result.message ?? "Unknown error"}`, {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      setCars((prev) => {
        const nextCars = prev.filter((car) => car.id !== id);
        try {
          const payload: CachedCarsPayload = {
            data: nextCars,
            cachedAt: Date.now(),
          };
          sessionStorage.setItem(CARS_CACHE_KEY, JSON.stringify(payload));
        } catch {
          // Ignore cache write failures.
        }
        return nextCars;
      });
      toast.success("Vehicle deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch {
      toast.error("Something went wrong while deleting.", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setDeleteId(null);
    }
  };


  const filteredCars = cars.filter((car) =>
    `${car.name} ${car.category} ${car.type} ${car.fuel} ${car.badge}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const primaryImageFor = (car: Car) => normalizeCarImages(car.image, car.image_urls ?? car.imageUrls)[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary/5 to-gray-100 py-10 px-4">
      <ToastContainer />

      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Vehicle Inventory</h1>
              <p className="text-sm text-gray-500">{cars.length} vehicle{cars.length !== 1 ? "s" : ""} listed</p>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              placeholder="Search vehicles..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-primary via-primary/40 to-transparent mb-6" />

        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-3" />
              <p className="text-sm font-medium text-gray-500">Loading vehicles...</p>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <svg className="w-14 h-14 mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
              </svg>
              <p className="text-lg font-semibold text-gray-300">No vehicles found</p>
              <p className="text-sm mt-1">Upload a vehicle to see it here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-widest">Vehicle</th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-widest">Category</th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-widest">Type</th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-widest">Price</th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-widest">Year</th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-widest">Mileage</th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-widest">Fuel</th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-widest">Transmission</th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-widest">Badge</th>
                    <th className="text-center px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredCars.map((car) => {
                    const previewImage = primaryImageFor(car);

                    return (
                      <tr key={car.id} className="hover:bg-primary/5 transition-colors duration-150 group">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 shadow-sm">
                              {previewImage ? (
                                <Image
                                  src={previewImage}
                                  alt={car.name}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <span className="font-semibold text-gray-800 whitespace-nowrap">{car.name || "-"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{car.category || "-"}</td>
                        <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{car.type || "-"}</td>
                        <td className="px-4 py-3.5 font-semibold text-primary whitespace-nowrap">
                          {car.price ? `RWF ${Number(car.price).toLocaleString()}` : "-"}
                        </td>
                        <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{car.year || "-"}</td>
                        <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                          {car.mileage ? `${Number(car.mileage).toLocaleString()} km` : "-"}
                        </td>
                        <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{car.fuel || "-"}</td>
                        <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{car.transmission || "-"}</td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          {car.badge ? (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                car.badge === "Featured" ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"
                              }`}
                            >
                              {car.badge}
                            </span>
                          ) : (
                            <span className="text-gray-300 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/admin/listings/${car.id}/edit`}
                              className="w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors duration-150"
                              title="Edit"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
                              </svg>
                            </Link>
                            <button
                              onClick={() => setDeleteId(Number(car.id))}
                              className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-colors duration-150"
                              title="Delete"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {filteredCars.length > 0 && (
          <p className="text-xs text-gray-400 mt-4 text-right">
            Showing {filteredCars.length} of {cars.length} vehicles
          </p>
        )}
      </div>

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Delete Vehicle?</h2>
              <p className="text-sm text-gray-500 mb-6">This action cannot be undone. The vehicle will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors shadow-lg shadow-red-100">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit is now handled in dedicated page: /admin/listings/[id]/edit */}
    </div>
  );
}
