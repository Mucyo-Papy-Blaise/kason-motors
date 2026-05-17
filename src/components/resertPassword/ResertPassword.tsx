"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.error || "Unable to send reset link.");
        return;
      }

      toast.success("Reset link sent to your email!");
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80"
        alt="Car"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to right, rgba(20,26,40,1) 0%, rgba(20,26,40,0.97) 20%, rgba(20,26,40,0.85) 35%, rgba(20,26,40,0.5) 55%, rgba(20,26,40,0.15) 75%, rgba(20,26,40,0) 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(20,26,40,0.6) 0%, transparent 15%, transparent 85%, rgba(20,26,40,0.6) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-20 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between px-4 py-10 sm:px-6">
        {/* NAV */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.jpeg"
              alt="Kason Motors"
              width={36}
              height={36}
              className="h-9 w-auto rounded-full object-contain"
            />
            <span className="text-base font-bold tracking-tight text-white">
              KASON <span className="text-primary">MOTORS</span>
            </span>
          </Link>

          <div className="flex items-center gap-6 text-sm text-white/50">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Login
            </Link>
          </div>
        </div>

        {/* FORM */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-white/40">
              Account Recovery
            </p>
            <h1 className="text-4xl font-bold leading-tight text-white">
              Forgot Password
            </h1>
            <p className="mt-3 text-sm text-white/40">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </motion.div>

          {/* FORM */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            {/* EMAIL */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/30">
                Email
              </label>

              <div className="relative">
                <input
                  type="email"
                  value={email}
                  placeholder="you@example.com"
                  required
                  className="w-full py-3.5 pl-4 pr-11 text-sm text-white outline-none transition-all placeholder:text-white/20"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={(e) =>
                    (e.currentTarget.style.border =
                      "1px solid var(--primary)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.border =
                      "1px solid rgba(255,255,255,0.12)")
                  }
                />

                <Mail
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25"
                />
              </div>
            </div>

            {/* BUTTON */}
            <div className="mt-2">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileTap={{ scale: 0.98 }}
                className="w-full cursor-pointer bg-primary py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </motion.button>
            </div>

            {/* BACK TO LOGIN */}
            <p className="text-center text-xs text-white/40">
              Remember password?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </motion.form>
        </motion.div>

        <div />
      </div>
    </div>
  );
}