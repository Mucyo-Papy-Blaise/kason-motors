"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, User, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        toast.error(body?.error ?? "Failed to create account.");
        return;
      }

      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
  };

  const focusBorder = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.border = "1px solid var(--primary)");

  const blurBorder = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.12)");

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />

      <Image
        src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&q=80"
        alt="Car"
        fill
        className="object-cover"
        priority
      />

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

      <div className="relative z-20 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between px-4 py-10 sm:px-6">
        {/* Nav */}
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
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <Link href="/login" className="transition-colors hover:text-white">Login</Link>
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-white/40">
              Start For Free
            </p>
            <h1 className="text-4xl font-bold leading-tight text-white">
              Create new account<span className="text-primary">.</span>
            </h1>
            <p className="mt-3 text-sm text-white/40">
              Already a member?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "First Name", placeholder: "Jean", value: firstName, onChange: setFirstName },
                { label: "Last Name", placeholder: "Pierre", value: lastName, onChange: setLastName },
              ].map((f) => (
                <div key={f.label}>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/30">
                    {f.label}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={f.placeholder}
                      value={f.value}
                      required
                      onChange={(e) => f.onChange(e.target.value)}
                      className="w-full py-3.5 pl-4 pr-10 text-sm text-white outline-none transition-all placeholder:text-white/20"
                      style={inputStyle}
                      onFocus={focusBorder}
                      onBlur={blurBorder}
                    />
                    <User size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25" />
                  </div>
                </div>
              ))}
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/30">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3.5 pl-4 pr-11 text-sm text-white outline-none transition-all placeholder:text-white/20"
                  style={inputStyle}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
                <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/30">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3.5 pl-4 pr-11 text-sm text-white outline-none transition-all placeholder:text-white/20"
                  style={inputStyle}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-white/20">Minimum 6 characters</p>
            </div>

            {/* Submit */}
            <div className="mt-2">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileTap={{ scale: 0.98 }}
                className="flex w-full cursor-pointer items-center justify-center gap-2 bg-primary py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                <UserPlus size={15} />
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </motion.button>
            </div>
          </motion.form>
        </motion.div>

        <div />
      </div>
    </div>
  );
}