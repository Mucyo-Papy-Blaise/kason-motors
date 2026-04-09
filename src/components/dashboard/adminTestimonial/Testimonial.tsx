// 📁 components/dashboard/adminTestimonial/Testimonial.tsx

"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ─── Types ────────────────────────────────────────────────────────────────────
type Testimonial = {
  id: number;
  name: string;
  role: string;
  text: string;
  created_at: string;
};

type TestimonialFormData = {
  name: string;
  role: string;
  text: string;
};

type FormErrors = Partial<Record<keyof TestimonialFormData, string>>;

// ─── Validation schema ────────────────────────────────────────────────────────
const testimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  text: z.string().min(10, "Testimonial must be at least 10 characters"),
});

// ─── Style helpers ────────────────────────────────────────────────────────────
const labelClass = "block text-xs font-medium text-gray-600 mb-1";

const inputClass = (error?: string) =>
  `w-full bg-white border rounded px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary transition ${
    error ? "border-red-400" : "border-gray-300"
  }`;

const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? <p className="mt-1 text-xs text-red-500">{msg}</p> : null;

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminTestimonial() {
  const emptyForm: TestimonialFormData = {
    name: "",
    role: "",
    text: "",
  };

  const [form, setForm] = useState<TestimonialFormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ── Fetch: GET /api/testimonials ─────────────────────────────────────────
  const fetchTestimonials = async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      if (!data.success) {
        toast.error("Failed to load testimonials");
      } else {
        setTestimonials(data.data ?? []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while loading testimonials");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // ── Handle input changes ─────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);

    if (submitted) {
      const result = testimonialSchema.safeParse(updated);
      if (!result.success) {
        const msg =
          result.error.flatten().fieldErrors[
            name as keyof TestimonialFormData
          ]?.[0];
        setErrors((prev) => ({ ...prev, [name]: msg }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  // ── Submit: POST /api/testimonials/add ───────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    const result = testimonialSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const [key, messages] of Object.entries(
        result.error.flatten().fieldErrors
      )) {
        fieldErrors[key as keyof TestimonialFormData] = (
          messages as string[]
        )?.[0];
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSending(true);

    try {
      const res = await fetch("/api/testimonials/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Failed to save testimonial");
        return;
      }

      toast.success("Testimonial saved successfully");
      setForm(emptyForm);
      setErrors({});
      setSubmitted(false);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsSending(false);
    }
  };

  // ── Delete: DELETE /api/testimonials/[id] ────────────────────────────────
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Failed to delete testimonial");
      } else {
        toast.success("Testimonial deleted");
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <ToastContainer />

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Testimonials</h1>
      <p className="text-sm text-gray-500 mb-8">
        Add customer testimonials that appear on the public homepage.
      </p>

      {/* ── Add Form ────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-10">
        <h2 className="text-base font-semibold text-gray-800 mb-5">
          Add New Testimonial
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name + Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Customer Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={inputClass(errors.name)}
              />
              <ErrorMsg msg={errors.name} />
            </div>
            <div>
              <label className={labelClass}>Role / Title</label>
              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="Car Buyer · Kigali"
                className={inputClass(errors.role)}
              />
              <ErrorMsg msg={errors.role} />
            </div>
          </div>

          {/* Testimonial Text */}
          <div>
            <label className={labelClass}>Testimonial Text</label>
            <textarea
              name="text"
              value={form.text}
              onChange={handleChange}
              rows={4}
              placeholder="Write the customer's testimonial here..."
              className={inputClass(errors.text)}
            />
            <ErrorMsg msg={errors.text} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSending}
            className="w-full bg-primary cursor-pointer py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-70"
          >
            {isSending ? "Saving..." : "Add Testimonial"}
          </button>
        </form>
      </div>

      {/* ── Existing Testimonials List ───────────────────────────────────── */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-4">
          Existing Testimonials{" "}
          <span className="text-gray-400 font-normal">
            ({testimonials.length})
          </span>
        </h2>

        {loadingList ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : testimonials.length === 0 ? (
          <p className="text-sm text-gray-400">
            No testimonials yet. Add one above.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col gap-3"
              >
                <p className="text-gray-600 text-sm leading-relaxed">
                  &quot;{t.text}&quot;
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {t.name}
                    </p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>

                  <button
                    onClick={() => handleDelete(t.id)}
                    disabled={deletingId === t.id}
                    className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 rounded px-3 py-1.5 transition disabled:opacity-50 cursor-pointer"
                  >
                    {deletingId === t.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}