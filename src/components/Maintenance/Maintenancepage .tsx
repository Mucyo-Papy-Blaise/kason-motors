"use client";

import React, { useState } from "react";
import Navbar from "../landingPage/Navbar";
import Footer from "../landingPage/Footer";
import { User, Phone, Mail, Car, Shield, FileText, X, Send, CheckCircle } from "lucide-react";

const EMPTY_MAINTENANCE_FORM = {
  requestSummary: "",
  name: "",
  phone: "",
  email: "",
  vehicleModel: "",
  licensePlate: "",
  needsInsurance: false,
  insurance: "",
  insurancePolicyNumber: "",
};

type MaintenanceFormData = typeof EMPTY_MAINTENANCE_FORM;
type FormErrors = Partial<Record<keyof MaintenanceFormData, string>>;

function validate(form: MaintenanceFormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.requestSummary.trim()) errors.requestSummary = "Please describe your request";
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.phone.trim()) errors.phone = "Phone number is required";
  if (form.needsInsurance && !form.insurance.trim())
    errors.insurance = "Insurance provider is required";
  return errors;
}

const SectionHeader = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) => (
  <div className="flex items-start gap-3 mb-5">
    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-bold text-font">{title}</h3>
      {subtitle && <p className="text-xs text-gray-mid mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const Field = ({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-xs font-semibold text-gray-mid uppercase tracking-widest mb-1.5">
      {label} {required && <span className="text-primary">*</span>}
    </label>
    {children}
    {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
  </div>
);

const inputClass = (hasError?: boolean) =>
  `w-full bg-bg border rounded-lg px-4 py-3 text-sm text-font placeholder-gray-mid/60 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 shadow-sm ${
    hasError
      ? "border-red-400/60 focus:ring-red-400/40"
      : "border-line/30 focus:ring-primary/40 hover:border-primary/30"
  }`;

export const MaintenancePage: React.FC = () => {
  const [form, setForm] = useState<MaintenanceFormData>(EMPTY_MAINTENANCE_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (submitted) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleClear = () => {
    setForm(EMPTY_MAINTENANCE_FORM);
    setErrors({});
    setSubmitted(false);
    setSuccess(false);
    setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError(null);

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as { success: boolean; message?: string };

      if (!res.ok || !data.success) {
        setServerError(data.message ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-bg flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-font mb-3">Request Submitted!</h2>
            <p className="text-gray-mid text-sm mb-6">
              We've received your maintenance request. Our team will contact you shortly.
            </p>
            <button
              onClick={handleClear}
              className="bg-primary text-font text-sm font-bold px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Submit Another Request
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg text-font">
        {/* Hero */}
        <section className="relative h-[min(52vh,420px)] w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: "url('/marcedes.jpg')" }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-primary-dark/85 via-primary/60 to-ink/80" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
            <span className="inline-block text-accent text-xs font-bold tracking-[0.25em] uppercase mb-4 border border-accent/40 px-4 py-1 rounded-full">
              Vehicle Care
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-font mb-3">Maintenance Request</h1>
            <p className="text-font/70 text-sm max-w-md mx-auto uppercase tracking-[0.15em]">
              Fill in the form below and our team will get back to you as soon as possible.
            </p>
          </div>
        </section>

        {/* Form */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Request Summary */}
            <div className="bg-gray-dark border border-line/25 rounded-xl p-6">
              <SectionHeader
                icon={<FileText size={16} />}
                title="Request Summary"
                subtitle="Briefly describe what maintenance or repair you need"
              />
              <Field label="Describe your request" required error={errors.requestSummary}>
                <textarea
                  name="requestSummary"
                  value={form.requestSummary}
                  onChange={handleChange}
                  rows={4}
                  placeholder="e.g. My car makes a grinding noise when braking, needs an oil change..."
                  className={inputClass(!!errors.requestSummary)}
                />
              </Field>
            </div>

            {/* Contact Details */}
            <div className="bg-gray-dark border border-line/25 rounded-xl p-6">
              <SectionHeader
                icon={<User size={16} />}
                title="Contact Details"
                subtitle="How we'll reach you about your request"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Name" required error={errors.name}>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={inputClass(!!errors.name)}
                  />
                </Field>
                <Field label="Phone" required error={errors.phone}>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+250 7xx xxx xxx"
                    inputMode="tel"
                    className={inputClass(!!errors.phone)}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Contact Email" error={errors.email}>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      type="email"
                      className={inputClass(!!errors.email)}
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* Vehicle */}
            <div className="bg-gray-dark border border-line/25 rounded-xl p-6">
              <SectionHeader
                icon={<Car size={16} />}
                title="Vehicle"
                subtitle="Tell us about the vehicle that needs service"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Vehicle Manufacturer and Model" error={errors.vehicleModel}>
                  <input
                    name="vehicleModel"
                    value={form.vehicleModel}
                    onChange={handleChange}
                    placeholder="e.g. Toyota BZ3X"
                    className={inputClass(!!errors.vehicleModel)}
                  />
                </Field>
                <Field label="License Plate Number" error={errors.licensePlate}>
                  <input
                    name="licensePlate"
                    value={form.licensePlate}
                    onChange={handleChange}
                    placeholder="e.g. RAC 123A"
                    className={inputClass(!!errors.licensePlate)}
                  />
                </Field>
              </div>
            </div>

            {/* Insurance */}
            <div className="bg-gray-dark border border-line/25 rounded-xl p-6">
              <SectionHeader
                icon={<Shield size={16} />}
                title="Insurance"
                subtitle="Let us know if your insurance will cover this repair"
              />
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="needsInsurance"
                    checked={form.needsInsurance}
                    onChange={handleChange}
                    className="accent-primary w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-font group-hover:text-primary transition-colors">
                    Do you need your insurance to pay for this repair?
                  </span>
                </label>

                {form.needsInsurance && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-line/20">
                    <Field label="Insurance" required error={errors.insurance}>
                      <input
                        name="insurance"
                        value={form.insurance}
                        onChange={handleChange}
                        placeholder="e.g. SORAS, RADIANT"
                        className={inputClass(!!errors.insurance)}
                      />
                    </Field>
                    <Field label="Insurance Policy #" error={errors.insurancePolicyNumber}>
                      <input
                        name="insurancePolicyNumber"
                        value={form.insurancePolicyNumber}
                        onChange={handleChange}
                        placeholder="e.g. POL-2024-XXXXX"
                        className={inputClass(!!errors.insurancePolicyNumber)}
                      />
                    </Field>
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-mid px-1">
              <span className="text-primary font-bold">*</span> Required fields
            </p>

            {serverError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {serverError}
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-line/30 text-sm font-semibold text-gray-mid hover:text-font hover:border-line/60 transition-all duration-200"
              >
                <X size={15} />
                Clear form
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-font text-sm font-bold hover:bg-primary-dark transition-colors duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send size={15} />
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};