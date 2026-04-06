"use client";

import { carSchema } from "@/Cars.Schema";
import { Car, EMPTY_FORM, FormErrors } from "@/types/car";
import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VehicleList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editCar, setEditCar] = useState<Car | null>(null);
  const [editForm, setEditForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [editPreview, setEditPreview] = useState<string>("");
  const [editImageName, setEditImageName] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch("/api/vehicles/getList");
        const results = await res.json();
        if (results.success) {
          setCars(results.data);
        } else {
          console.log(results.message);
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };
    fetchCars();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/vehicles/delete/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        setCars((prev) => prev.filter((c) => c.id !== id));
        toast.success("Vehicle deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(`Delete failed: ${result.message}`, {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (error) {
      toast.error("Something went wrong while deleting.", {
        position: "top-right",
        autoClose: 4000,
      });
    }
    setDeleteId(null);
  };

  const openEdit = (car: Car) => {
    setEditCar(car);
    setEditForm({
      name: String(car.name),
      category: String(car.category),
      type: String(car.type),
      price: String(car.price),
      year: String(car.year),
      mileage: String(car.mileage),
      fuel: String(car.fuel),
      transmission: String(car.transmission),
      image: String(car.image),
      badge: String(car.badge),
    });
    setEditPreview(String(car.image));
    setEditImageName("");
    setFieldErrors({});
  };

  const handleEditChange = (e: any) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
    if (fieldErrors[name as keyof FormErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleEditImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImageName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setEditPreview(result);
      setEditForm((prev) => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleEditSave = async () => {
    if (!editCar) return;

    try {
      const res = await fetch(`/api/vehicles/update/${editCar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const result = await res.json();
      if (result.success) {
        setCars((prev) =>
          prev.map((c) => (c.id === editCar.id ? { ...c, ...editForm } : c))
        );
        setEditCar(null);
        toast.success("Vehicle updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(`Update failed: ${result.message}`, {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (error) {
      toast.error("Something went wrong while updating.", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const filtered = cars.filter((c) =>
    `${c.name} ${c.category} ${c.type} ${c.fuel} ${c.badge}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const inputClass =
    "w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm";
  const inputErrorClass =
    "w-full bg-white border border-red-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200 shadow-sm";
  const selectClass =
    "w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm appearance-none cursor-pointer";
  const selectErrorClass =
    "w-full bg-white border border-red-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200 shadow-sm appearance-none cursor-pointer";
  const labelClass =
    "block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1";

  const FieldError = ({ field }: { field: keyof FormErrors }) =>
    fieldErrors[field] ? (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {fieldErrors[field]}
      </p>
    ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary/5 to-gray-100 py-10 px-4">

      {/* ✅ Toast Container */}
      <ToastContainer />

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Vehicle Inventory</h1>
              <p className="text-sm text-gray-500">{cars.length} vehicle{cars.length !== 1 ? "s" : ""} listed</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              placeholder="Search vehicles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Primary accent line */}
        <div className="h-px bg-gradient-to-r from-primary via-primary/40 to-transparent mb-6" />

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
          <div className="" />

          {filtered.length === 0 ? (
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
                  {filtered.map((car) => (
                    <tr key={car.id} className="hover:bg-primary/5 transition-colors duration-150 group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 shadow-sm">
                            {car.image ? (
                              <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-gray-800 whitespace-nowrap">{car.name || "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{car.category || "—"}</td>
                      <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{car.type || "—"}</td>
                      <td className="px-4 py-3.5 font-semibold text-primary whitespace-nowrap">
                        {car.price ? `$${Number(car.price).toLocaleString()}` : "—"}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{car.year || "—"}</td>
                      <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                        {car.mileage ? `${Number(car.mileage).toLocaleString()} km` : "—"}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{car.fuel || "—"}</td>
                      <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{car.transmission || "—"}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {car.badge ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            car.badge === "Featured" ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"
                          }`}>
                            {car.badge}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEdit(car)}
                            className="w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors duration-150"
                            title="Edit"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
                            </svg>
                          </button>
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {filtered.length > 0 && (
          <p className="text-xs text-gray-400 mt-4 text-right">
            Showing {filtered.length} of {cars.length} vehicles
          </p>
        )}
      </div>

      {/* DELETE MODAL */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-white" />
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

      {/* EDIT MODAL */}
      {editCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-8 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-auto">
            <div className="bg-white" />
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Edit Vehicle</h2>
                  <p className="text-xs text-gray-400">{editCar.name}</p>
                </div>
              </div>
              <button onClick={() => setEditCar(null)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Car Name</label>
                  <input name="name" value={editForm.name} onChange={handleEditChange} className={fieldErrors.name ? inputErrorClass : inputClass} placeholder="Car name" />
                  <FieldError field="name" />
                </div>
                <div>
                  <label className={labelClass}>Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input name="price" value={editForm.price} onChange={handleEditChange} className={`${fieldErrors.price ? inputErrorClass : inputClass} pl-7`} placeholder="0.00" />
                  </div>
                  <FieldError field="price" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Category</label>
                  <div className="relative">
                    <select name="category" value={editForm.category} onChange={handleEditChange} className={fieldErrors.category ? selectErrorClass : selectClass}>
                      <option value="">Select Category</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Economy">Economy</option>
                      <option value="Electric">Electric</option>
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <FieldError field="category" />
                </div>
                <div>
                  <label className={labelClass}>Body Type</label>
                  <div className="relative">
                    <select name="type" value={editForm.type} onChange={handleEditChange} className={fieldErrors.type ? selectErrorClass : selectClass}>
                      <option value="">Select Type</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <FieldError field="type" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className={labelClass}>Year</label>
                  <input name="year" value={editForm.year} onChange={handleEditChange} className={fieldErrors.year ? inputErrorClass : inputClass} placeholder="2022" />
                  <FieldError field="year" />
                </div>
                <div>
                  <label className={labelClass}>Mileage</label>
                  <input name="mileage" value={editForm.mileage} onChange={handleEditChange} className={fieldErrors.mileage ? inputErrorClass : inputClass} placeholder="km" />
                  <FieldError field="mileage" />
                </div>
                <div>
                  <label className={labelClass}>Fuel</label>
                  <div className="relative">
                    <select name="fuel" value={editForm.fuel} onChange={handleEditChange} className={fieldErrors.fuel ? selectErrorClass : selectClass}>
                      <option value="">Fuel</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                    </select>
                    <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <FieldError field="fuel" />
                </div>
                <div>
                  <label className={labelClass}>Transmission</label>
                  <div className="relative">
                    <select name="transmission" value={editForm.transmission} onChange={handleEditChange} className={fieldErrors.transmission ? selectErrorClass : selectClass}>
                      <option value="">Trans.</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                    <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <FieldError field="transmission" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Vehicle Image</label>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleEditImage} className="hidden" />
                {editPreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-100 shadow-sm group h-36">
                    <img src={editPreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
                        </svg>
                        Change
                      </button>
                      <button type="button" onClick={() => { setEditPreview(""); setEditForm(p => ({ ...p, image: "" })); }} className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Remove
                      </button>
                    </div>
                    {editImageName && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-3 py-1 text-white text-xs truncate">
                        {editImageName}
                      </div>
                    )}
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 rounded-xl py-6 flex flex-col items-center gap-1.5 transition-all group">
                    <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center group-hover:scale-105 transition-transform">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-primary">Click to upload image</p>
                    <p className="text-xs text-gray-400">PNG, JPG, WEBP</p>
                  </button>
                )}
              </div>

              <div>
                <label className={labelClass}>Badge</label>
                <div className="flex gap-4">
                  {["New Arrival", "Featured", ""].map((b) => (
                    <label key={b || "none"} className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="badge" value={b} checked={editForm.badge === b} onChange={handleEditChange} className="accent-primary w-4 h-4" />
                      <span className="text-sm text-gray-600 font-medium transition-colors">{b || "None"}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setEditCar(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleEditSave} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}