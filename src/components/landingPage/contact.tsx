"use client";

import { useState } from "react";
import { z } from "zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  phonenumber: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .regex(/^[+\d\s\-()]+$/, "Enter a valid phone number"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;
type FormErrors = Partial<Record<keyof ContactFormData, string>>;

export default function Contact() {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phonenumber: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

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

    setIsSending(true);

    try {
      const res = await fetch("/api/notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phonenumber: form.phonenumber,
          message: form.message,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error("Failed to send message");
        return;
      }

      toast.success("Message sent successfully");
      setForm({ name: "", email: "", phonenumber: "", message: "" });
      setErrors({});
      setSubmitted(false);
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const inputClass = (field: keyof ContactFormData) =>
    `w-full bg-white border rounded px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary transition ${
      errors[field] ? "border-red-400" : "border-gray-300"
    }`;

  const labelClass = "block text-xs font-medium text-gray-600 mb-1";

  const ErrorMsg = ({ field }: { field: keyof ContactFormData }) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
    ) : null;

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer />
<Navbar/>
      {/* ─── Hero Section ─── */}
      <section className="relative w-full h-[420px] overflow-hidden">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55 z-10" />

        {/* Background image — replace src with your actual showroom image */}
        <img
          src="/marcedes.jpg"
          alt="Car showroom"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Hero text */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
            Experience Our Service
          </h1>
          <p className="mt-3 text-sm text-white/80">Schedule a visit</p>
        </div>
      </section>

      {/* ─── Get In Touch Section ─── */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section heading */}
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Get In Touch</h2>
            <p className="text-sm text-gray-500 mt-1">
              Have questions or want to schedule a test drive? Our team is ready
              to assist you.
            </p>
          </div>

          {/* Map + Form side-by-side */}
          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            {/* Map */}
            <div className="flex-1 min-h-[360px] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <iframe
                title="Our Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.4956836786455!2d30.05887!3d-1.94995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwNTYnNTkuOCJTIDMwwrAwMyczMS45IkU!5e0!3m2!1sen!2srw!4v1681234567890!5m2!1sen!2srw"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "360px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Form card */}
            <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="text-base mb-5 font-semibold text-gray-800 mb-0.5">
                Send us a message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={inputClass("name")}
                  />
                  <ErrorMsg field="name" />
                </div>

                {/* Email */}
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={inputClass("email")}
                  />
                  <ErrorMsg field="email" />
                </div>

                {/* Phone Number */}
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input
                    name="phonenumber"
                    type="tel"
                    value={form.phonenumber}
                    onChange={handleChange}
                    placeholder="+250 700 000 000"
                    className={inputClass("phonenumber")}
                  />
                  <ErrorMsg field="phonenumber" />
                </div>

                {/* Message */}
                <div>
                  <label className={labelClass}>Your Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Write your message here..."
                    className={inputClass("message")}
                  />
                  <ErrorMsg field="message" />
                </div>

                {/* Submit button — matches login page style */}
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-primary cursor-pointer py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-70"
                >
                  {isSending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}