import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const quickLinks = [
  { label: "Home", href: "#" },
  { label: "Inventory", href: "#" },
  { label: "About Us", href: "#" },
  { label: "Dealers", href: "#" },
  { label: "Contact", href: "#" },
];

const carTypes = [
  { label: "SUV", href: "#" },
  { label: "Sedan", href: "#" },
  { label: "Pickup", href: "#" },
  { label: "Crossover", href: "#" },
  { label: "Electric", href: "#" },
];

const socials = [
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: FaXTwitter, href: "#", label: "Twitter" },
  { icon: FaYoutube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-dark">
      {/* Top CTA strip */}
      <div className="border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-primary mb-1">
              Ready to drive?
            </p>
            <h3 className="text-white font-bold text-xl leading-tight">
              Find your perfect vehicle today.
            </h3>
          </div>
          <Link
            href="#"
            className="shrink-0 flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-full transition-all duration-200 shadow-lg shadow-primary/20"
          >
            Browse Inventory <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand col */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image
                src="/logo.jpeg"
                alt="Kason Motors"
                width={38}
                height={38}
                className="rounded-xl object-cover"
                style={{ width: 38, height: 38 }}
              />
              <span className="font-bold text-white text-base tracking-tight">
                KASON <span className="text-primary">MOTORS</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Rwanda&apos;s most trusted car dealership. Quality vehicles,
              transparent pricing, and a team that puts you first.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all duration-150"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/40 text-sm hover:text-primary transition-colors duration-150 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-primary transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Car Types */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-5">
              Browse By Type
            </h4>
            <ul className="space-y-3">
              {carTypes.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/40 text-sm hover:text-primary transition-colors duration-150 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-primary transition-colors" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-5">
              Contact Us
            </h4>
            <ul className="space-y-3.5">
              <li>
                <a
                  href="tel:+250791000000"
                  className="flex items-start gap-3 text-white/40 text-sm hover:text-white transition-colors group"
                >
                  <span className="mt-0.5 w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Phone size={12} className="text-primary" />
                  </span>
                  +250 791 000 000
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@kasonmotors.rw"
                  className="flex items-start gap-3 text-white/40 text-sm hover:text-white transition-colors group"
                >
                  <span className="mt-0.5 w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Mail size={12} className="text-primary" />
                  </span>
                  info@kasonmotors.rw
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/40 text-sm">
                  <span className="mt-0.5 w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <MapPin size={12} className="text-primary" />
                  </span>
                  KG 11 Ave, Kigali, Rwanda
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/40 text-sm">
                  <span className="mt-0.5 w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <Clock size={12} className="text-primary" />
                  </span>
                  Mon–Fri: 8:00–17:00
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">
            © 2026 Kason Motors. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-white/25 text-xs hover:text-white/60 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
