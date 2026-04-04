"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Mail, Eye, EyeOff, User, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex">
      {/* Full screen background image */}
      <Image
        src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&q=80"
        alt="Car"
        fill
        className="object-cover"
        priority
      />

      {/* Smooth gradient overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to right, rgba(20,26,40,1) 0%, rgba(20,26,40,0.97) 20%, rgba(20,26,40,0.85) 35%, rgba(20,26,40,0.5) 55%, rgba(20,26,40,0.15) 75%, rgba(20,26,40,0) 100%)",
        }}
      />
      {/* Top & bottom vignette */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(20,26,40,0.6) 0%, transparent 15%, transparent 85%, rgba(20,26,40,0.6) 100%)",
        }}
      />

      {/* LEFT SIDE - Form */}
      <div className="relative z-20 w-full  flex flex-col justify-between max-w-7xl mx-auto px-4 sm:px-6 py-10 min-h-screen">
        {/* Top Nav */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.jpeg"
              alt="Kason Motors"
              width={36}
              height={36}
              className="rounded-full h-9 w-auto object-contain"
            />
            <span className="font-bold text-white text-base tracking-tight">
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

        {/* Form Content */}
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
            <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-3">
              Start For Free
            </p>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Create new account<span className="text-primary">.</span>
            </h1>
            <p className="text-white/40 text-sm mt-3">
              Already a member?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-semibold"
              >
                Sign In
              </Link>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex flex-col gap-4"
          >
            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "First Name", placeholder: "Jean" },
                { label: "Last Name", placeholder: "Pierre" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-xs font-semibold text-white/30 tracking-widest uppercase block mb-1.5">
                    {f.label}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={f.placeholder}
                      className="w-full py-3.5 pl-4 pr-10 text-sm text-white placeholder-white/20 outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.border =
                          "1px solid var(--primary)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.border =
                          "1px solid rgba(255,255,255,0.12)")
                      }
                    />
                    <User
                      size={13}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-white/30 tracking-widest uppercase block mb-1.5">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full py-3.5 pl-4 pr-11  text-sm text-white placeholder-white/20 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.border = "1px solid var(--primary)")
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

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-white/30 tracking-widest uppercase block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full py-3.5 pl-4 pr-11  text-sm text-white placeholder-white/20 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid var(--primary)",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.border = "1px solid var(--primary)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.border =
                      "1px solid rgba(255,255,255,0.12)")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-2">
              <motion.button className="flex-1 py-3.5 text-sm font-bold text-white flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark cursor-pointer">
                <UserPlus size={15} /> Create Account
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        <div />
      </div>
    </div>
  );
}
