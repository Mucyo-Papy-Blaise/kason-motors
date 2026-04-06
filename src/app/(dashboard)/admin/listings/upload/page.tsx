"use client";

import { useState, useRef } from "react";
import { z } from "zod";
import { ToastContainer, toast } from "react-toastify";

// ─── ZOD SCHEMA ───────────────────────────────────────────────────────────────
const carSchema = z.object({
  name: z.string().min(2, "Car name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  type: z.string().min(1, "Please select a body type"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a valid number greater than 0",
    }),
  year: z
    .string()
    .min(1, "Year is required")
    .refine(
      (val) =>
        !isNaN(Number(val)) &&
        Number(val) >= 1900 &&
        Number(val) <= new Date().getFullYear() + 1,
      { message: `Year must be between 1900 and ${new Date().getFullYear() + 1}` }
    ),
  mileage: z
    .string()
    .min(1, "Mileage is required")
    .refine(
      (val) =>
        !isNaN(Number(val.replace(/,/g, ""))) &&
        Number(val.replace(/,/g, "")) >= 0,
      { message: "Mileage must be a valid number" }
    ),
  fuel: z.string().min(1, "Please select a fuel type"),
  transmission: z.string().min(1, "Please select a transmission"),
  image: z.string().min(1, "Please upload a vehicle image"),
  badge: z.string().optional(),
});

type CarFormData = z.infer<typeof carSchema>;
type FormErrors = Partial<Record<keyof CarFormData, string>>;

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function UploadPage() {
  const [form, setForm] = useState<CarFormData>({
    name: "",
    category: "",
    type: "",
    price: "",
    year: "",
    mileage: "",
    fuel: "",
    transmission: "",
    image: "",
    badge: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<"" | "cloudinary" | "supabase" | "done">("");

  const validateField = (name: keyof CarFormData, value: string) => {
    const result = carSchema.safeParse({ ...form, [name]: value });
    if (!result.success) {
      const msg = result.error.flatten().fieldErrors[name]?.[0];
      setErrors((prev) => ({ ...prev, [name]: msg }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (submitted) validateField(name as keyof CarFormData, value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageBase64(result);
      setForm((prev) => ({ ...prev, image: result }));
      if (submitted) setErrors((prev) => ({ ...prev, image: undefined }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageName("");
    setImageBase64("");
    setForm((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (submitted)
      setErrors((prev) => ({ ...prev, image: "Please upload a vehicle image" }));
  };

  const resetForm = () => {
    setForm({
      name: "", category: "", type: "", price: "", year: "",
      mileage: "", fuel: "", transmission: "", image: "", badge: "",
    });
    setErrors({});
    setSubmitted(false);
    setImagePreview(null);
    setImageName("");
    setImageBase64("");
    setUploadStep("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitted(true);

    const result = carSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const [key, messages] of Object.entries(
        result.error.flatten().fieldErrors
      )) {
        fieldErrors[key as keyof CarFormData] = (messages as string[])?.[0];
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      setIsUploading(true);

      setUploadStep("cloudinary");

      const cloudinaryRes = await fetch("/api/uploadToCloudinary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mainImage: imageBase64 }),
      });

      const cloudinaryData = await cloudinaryRes.json();

      if (!cloudinaryData.success) {
        throw new Error(cloudinaryData.message || "Failed to upload image to Cloudinary");
      }

      const cloudinaryImageUrl: string = cloudinaryData.mainImageUrl;

      setUploadStep("supabase");

      const supabaseRes = await fetch("/api/vehicles/car", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          image: cloudinaryImageUrl,
        }),
      });

      const supabaseData = await supabaseRes.json();

      if (!supabaseData.success) {
        throw new Error(supabaseData.message || "Failed to save car to database");
      }

      setUploadStep("done");
      toast.success("Vehicle uploaded successfully!");
      resetForm();
    } catch (err: any) {
      toast.error(` Upload failed: ${err.message}`);
      setUploadStep("");
    } finally {
      setIsUploading(false);
    }
  };

  // ─── Style helpers ────────────────────────────────────────────────────────
  const inputClass = (field: keyof CarFormData) =>
    `w-full bg-white border rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 shadow-sm ${
      errors[field]
        ? "border-red-400 focus:ring-red-400 hover:border-red-400"
        : "border-gray-200 focus:ring-primary hover:border-primary/50"
    }`;

  const selectClass = (field: keyof CarFormData) =>
    `w-full bg-white border rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 shadow-sm appearance-none cursor-pointer ${
      errors[field]
        ? "border-red-400 focus:ring-red-400"
        : "border-gray-200 focus:ring-primary hover:border-primary/50"
    }`;

  const labelClass =
    "block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5";

  const ErrorMsg = ({ field }: { field: keyof CarFormData }) =>
    errors[field] ? (
      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
        <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        {errors[field]}
      </p>
    ) : null;

  // ─── Upload progress indicator ────────────────────────────────────────────
  const UploadProgress = () => {
    if (!isUploading) return null;
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-80 flex flex-col items-center gap-5">
          <div className="w-14 h-14 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="text-center">
            <p className="font-bold text-gray-800 text-base">
              {uploadStep === "cloudinary" && "Uploading image…"}
              {uploadStep === "supabase" && "Saving to database…"}
              {uploadStep === "done" && "All done!"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {uploadStep === "cloudinary" && "Sending image to Cloudinary"}
              {uploadStep === "supabase" && "Writing car record to Supabase"}
            </p>
          </div>
          <div className="flex items-center gap-2 w-full justify-center">
            <StepDot
              label="Cloudinary"
              active={uploadStep === "cloudinary"}
              done={uploadStep === "supabase" || uploadStep === "done"}
            />
            <div className="flex-1 h-px bg-gray-200 max-w-8" />
            <StepDot
              label="Supabase"
              active={uploadStep === "supabase"}
              done={uploadStep === "done"}
            />
          </div>
        </div>
      </div>
    );
  };

  const StepDot = ({
    label,
    active,
    done,
  }: {
    label: string;
    active: boolean;
    done: boolean;
  }) => (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
          done
            ? "bg-primary text-white"
            : active
            ? "bg-primary/10 border-2 border-primary text-primary"
            : "bg-gray-100 text-gray-400"
        }`}
      >
        {done ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : active ? (
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-gray-300" />
        )}
      </div>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );

  return (
    <>
      {/* <UploadProgress /> */}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary/5 to-gray-100 flex items-start justify-center py-12 px-4">
        <div className="w-full max-w-2xl">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Upload Vehicle</h1>
                <p className="text-sm text-gray-500">Fill in the details to list your vehicle</p>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-primary via-primary/40 to-transparent mt-4" />
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">

              {/* Section: Basic Info */}
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-5 h-px bg-primary/40 inline-block" />
                  Basic Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Car Name</label>
                    <input
                      name="name"
                      value={form.name}
                      placeholder="e.g. Toyota Land Cruiser"
                      onChange={handleChange}
                      className={inputClass("name")}
                    />
                    <ErrorMsg field="name" />
                  </div>
                  <div>
                    <label className={labelClass}>Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                      <input
                        name="price"
                        value={form.price}
                        placeholder="0.00"
                        onChange={handleChange}
                        className={`${inputClass("price")} pl-8`}
                      />
                    </div>
                    <ErrorMsg field="price" />
                  </div>
                </div>
              </div>

              {/* Section: Classification */}
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-5 h-px bg-primary/40 inline-block" />
                  Classification
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Category</label>
                    <div className="relative">
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className={selectClass("category")}
                      >
                        <option value="">Select Category</option>
                        <option value="Luxury">Luxury</option>
                        <option value="Economy">Economy</option>
                        <option value="Electric">Electric</option>
                      </select>
                      <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <ErrorMsg field="category" />
                  </div>
                  <div>
                    <label className={labelClass}>Body Type</label>
                    <div className="relative">
                      <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className={selectClass("type")}
                      >
                        <option value="">Select Type</option>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                      </select>
                      <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <ErrorMsg field="type" />
                  </div>
                </div>
              </div>

              {/* Section: Vehicle Details */}
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-5 h-px bg-primary/40 inline-block" />
                  Vehicle Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Year</label>
                    <input
                      name="year"
                      value={form.year}
                      placeholder="e.g. 2022"
                      onChange={handleChange}
                      className={inputClass("year")}
                    />
                    <ErrorMsg field="year" />
                  </div>
                  <div>
                    <label className={labelClass}>Mileage (km)</label>
                    <input
                      name="mileage"
                      value={form.mileage}
                      placeholder="e.g. 15,000"
                      onChange={handleChange}
                      className={inputClass("mileage")}
                    />
                    <ErrorMsg field="mileage" />
                  </div>
                  <div>
                    <label className={labelClass}>Fuel Type</label>
                    <div className="relative">
                      <select
                        name="fuel"
                        value={form.fuel}
                        onChange={handleChange}
                        className={selectClass("fuel")}
                      >
                        <option value="">Select Fuel</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                      </select>
                      <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <ErrorMsg field="fuel" />
                  </div>
                  <div>
                    <label className={labelClass}>Transmission</label>
                    <div className="relative">
                      <select
                        name="transmission"
                        value={form.transmission}
                        onChange={handleChange}
                        className={selectClass("transmission")}
                      >
                        <option value="">Select Transmission</option>
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                      <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <ErrorMsg field="transmission" />
                  </div>
                </div>
              </div>

              {/* Section: Media & Badge */}
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-5 h-px bg-primary/40 inline-block" />
                  Media & Badge
                </p>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Vehicle Image</label>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    {!imagePreview ? (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full border-2 border-dashed rounded-xl py-8 flex flex-col items-center justify-center gap-2 transition-all duration-200 group cursor-pointer ${
                          errors.image
                            ? "border-red-300 bg-red-50/40 hover:border-red-400"
                            : "border-primary/30 bg-primary/5 hover:border-primary/60 hover:bg-primary/10"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center group-hover:scale-105 transition-transform duration-200 ${errors.image ? "shadow-red-100" : "shadow-primary/10"}`}>
                          <svg className={`w-6 h-6 ${errors.image ? "text-red-400" : "text-primary"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className={`text-sm font-semibold ${errors.image ? "text-red-500" : "text-primary"}`}>
                            Click to upload image
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP up to 10MB</p>
                        </div>
                      </button>
                    ) : (
                      <div className="relative rounded-xl overflow-hidden border border-primary/20 shadow-sm group">
                        <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors flex items-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
                            </svg>
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Remove
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-3 py-1.5 flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                          </svg>
                          <span className="text-white text-xs truncate">{imageName}</span>
                        </div>
                      </div>
                    )}
                    <ErrorMsg field="image" />
                  </div>

                  <div>
                    <label className={labelClass}>Badge</label>
                    <div className="flex gap-3">
                      {["New Arrival", "Featured"].map((b) => (
                        <label key={b} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="badge"
                            value={b}
                            onChange={handleChange}
                            className="accent-primary w-4 h-4 cursor-pointer"
                          />
                          <span className="text-sm text-gray-600 group-hover:text-primary transition-colors font-medium">
                            {b}
                          </span>
                        </label>
                      ))}
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="badge"
                          value=""
                          defaultChecked
                          onChange={handleChange}
                          className="accent-primary w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-primary transition-colors font-medium">None</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100" />

              {/* Submit */}
              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-primary hover:bg-primary/90 active:bg-primary/80 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-sm tracking-wide"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {uploadStep === "cloudinary" ? "Uploading image…" : "Saving to database…"}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Vehicle
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}