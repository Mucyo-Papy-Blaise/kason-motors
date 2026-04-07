"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MapPin,
  Phone,
  Clock,
  Menu,
  X,
  ChevronRight,
  User,
  LogOut,
} from "lucide-react";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Inventory", href: "inventory" },
  { label: "About", href: "about" },
  { label: "Contact Us", href: "contact" },
];

type NavbarProps = {
  user?: { fullName: string; email: string; role: string } | null;
};

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/inventory") {
      return pathname === "/inventory" || pathname.startsWith("/inventory/");
    }
    return false;
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handler = () => setUserMenuOpen(false);
    if (userMenuOpen) document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [userMenuOpen]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const initials = user?.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* ── Top Bar — always dark, hidden on scroll ── */}
      <div
        className={`w-full z-50 transition-all duration-300 bg-gray-dark/80 ${
          scrolled ? "hidden" : "block"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-3 sm:gap-5 text-xs text-white/60">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} />
            <span className="hidden sm:inline">KG 11 Ave, Kigali, Rwanda</span>
            <span className="sm:hidden">Kigali, RW</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Phone size={12} /> +250 791 000 000
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <Clock size={12} /> Mon–Fri: 8:00–17:00
          </span>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <nav
        className={`w-full z-50 transition-all duration-500 ${
          scrolled
            ? "fixed top-0 left-0 right-0 bg-white shadow-lg"
            : "relative bg-gray-dark"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.jpeg"
              alt="Kason Motors"
              width={44}
              height={44}
              className="w-auto h-9 sm:h-11 object-contain rounded-full"
            />
            <span
              className={`text-base sm:text-xl font-bold tracking-tight ${
                scrolled ? "text-gray-dark" : "text-white"
              }`}
            >
              KASON <span className="text-primary">MOTORS</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-semibold rounded transition-all duration-200 ${
                    isActive
                      ? "text-primary"
                      : scrolled
                        ? "text-gray-dark hover:text-primary"
                        : "text-white hover:text-white/70"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right — Auth */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpen((v) => !v);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    scrolled
                      ? "border-line text-gray-dark hover:border-primary hover:text-primary"
                      : "border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      scrolled
                        ? "bg-primary/10 text-primary"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    {initials}
                  </span>
                  {user.fullName.split(" ")[0]}
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-line overflow-hidden z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-4 py-3 border-b border-line bg-subtle">
                        <p className="text-xs font-bold text-gray-dark truncate">
                          {user.fullName}
                        </p>
                        <p className="text-[11px] text-gray-mid truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-dark hover:bg-subtle hover:text-primary transition-colors"
                        >
                          <User size={14} className="text-gray-mid" /> Admin
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-dark hover:bg-red-50 hover:text-red-500 transition-colors w-full"
                      >
                        <LogOut size={14} className="text-gray-mid" />
                        {isLoggingOut ? "Signing out..." : "Log Out"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className={`hidden md:flex px-5 py-2 rounded-full text-sm font-semibold items-center gap-2 transition-all duration-300 ${
                  scrolled
                    ? "bg-primary text-white hover:bg-primary-dark shadow-md"
                    : "bg-white/15 text-white border border-white/25 hover:bg-white/25"
                }`}
              >
                Sign In
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className={`md:hidden flex items-center justify-center w-9 h-9 rounded transition-colors ${
                scrolled
                  ? "text-gray-dark hover:bg-subtle"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Sidebar ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-72 bg-white z-70 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-line">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <Image
                    src="/logo.jpeg"
                    alt="Kason Motors"
                    width={36}
                    height={36}
                    className="h-9 w-auto object-contain rounded-full"
                  />
                  <span className="font-bold text-gray-dark text-base">
                    KASON <span className="text-primary">MOTORS</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1.5 rounded-lg text-gray-mid hover:bg-subtle transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Nav */}
              <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
                <p className="text-xs font-bold text-gray-mid tracking-widest uppercase px-3 mb-3">
                  Menu
                </p>
                {navLinks.map((link, i) => {
                  const isActive = isLinkActive(link.href);
                  return (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => {
                          setMenuOpen(false);
                        }}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-primary text-white shadow-md"
                            : "text-gray-dark hover:bg-subtle hover:text-primary"
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronRight
                          size={16}
                          className={isActive ? "text-white/70" : "text-gray-mid"}
                        />
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.07 }}
                  className="mt-4 px-1"
                >
                  {user ? (
                    <div className="rounded-xl border border-line overflow-hidden">
                      <div className="px-4 py-3 bg-subtle flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-dark truncate">
                            {user.fullName}
                          </p>
                          <p className="text-[10px] text-gray-mid capitalize">
                            {user.role}
                          </p>
                        </div>
                      </div>
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-dark hover:bg-subtle hover:text-primary transition-colors border-t border-line"
                        >
                          <User size={14} className="text-gray-mid" /> Admin
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-dark hover:bg-red-50 hover:text-red-500 transition-colors w-full border-t border-line"
                      >
                        <LogOut size={14} className="text-gray-mid" /> Log Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center w-full py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-md hover:bg-primary-dark transition-all"
                    >
                      Log In to Your Account
                    </Link>
                  )}
                </motion.div>
              </nav>

              {/* Footer */}
              <div className="px-4 py-5 border-t border-line bg-subtle">
                <p className="text-xs font-bold text-gray-mid tracking-widest uppercase mb-3">
                  Contact
                </p>
                <div className="flex flex-col gap-2.5 text-xs text-gray-mid">
                  <span className="flex items-center gap-2">
                    <MapPin size={13} className="text-primary" /> KG 11 Ave,
                    Kigali, Rwanda
                  </span>
                  <span className="flex items-center gap-2">
                    <Phone size={13} className="text-primary" /> +250 791 000
                    000
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={13} className="text-primary" /> Mon–Fri:
                    8:00–17:00
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
