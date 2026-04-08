"use client";

import { useState } from "react";
import { z } from "zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ─── removed: getSupabaseServerClient import and const supabase ───

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;
type FormErrors = Partial<Record<keyof ContactFormData, string>>;

export default function Contact() {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as typeof e.target & {
      name: keyof ContactFormData;
    };
    const { name, value } = target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (submitted) {
      const result = contactSchema.safeParse({ ...form, [name]: value });
      if (!result.success) {
        const msg = result.error.flatten().fieldErrors[name]?.[0];
        setErrors((prev) => ({ ...prev, [name]: msg }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    const result = contactSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const [key, messages] of Object.entries(
        result.error.flatten().fieldErrors
      )) {
        fieldErrors[key as keyof ContactFormData] = (messages as string[])?.[0];
      }
      setErrors(fieldErrors);
      return;
    }

    // CALL THE API ROUTE — not Supabase directly
    try {
      const res = await fetch("/api/notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error("Failed to send message");
        return;
      }

      toast.success("Message sent successfully ");
      setForm({ name: "", email: "", message: "" });
      setErrors({});
      setSubmitted(false);

    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  const inputClass = (field: keyof ContactFormData) =>
    `w-full bg-white border rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition ${
      errors[field] ? "border-red-400" : "border-gray-200"
    }`;

  const labelClass =
    "block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5";

  const ErrorMsg = ({ field }: { field: keyof ContactFormData }) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
    ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary/5 to-gray-100 flex items-start justify-center py-14 px-4">
      <div className="w-full max-w-lg">
        <ToastContainer />

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Contact Us
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill the form below to send us a message
          </p>
          <div className="h-px bg-gradient-to-r from-primary via-primary/40 to-transparent mt-4" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className={inputClass("name")}
              />
              <ErrorMsg field="name" />
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={inputClass("email")}
              />
              <ErrorMsg field="email" />
            </div>

            <div>
              <label className={labelClass}>Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Write your message..."
                className={inputClass("message")}
              />
              <ErrorMsg field="message" />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white font-semibold py-3 rounded-lg"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}