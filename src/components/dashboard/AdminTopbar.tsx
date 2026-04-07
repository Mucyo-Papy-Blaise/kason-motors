"use client";
import {
  Bell,
  Search,
  LogOut,
  Settings,
  ChevronDown,
  LayoutDashboard
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type AdminTopbarProps = {
  fullName: string;
  roleLabel: string;
};

const getInitials = (fullName: string) =>
  fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

export default function AdminTopbar({ fullName, roleLabel }: AdminTopbarProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter()

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="bg-white border-b px-6 py-3.5 flex items-center justify-between shrink-0"
      style={{ borderColor: "var(--color-line)" }}
    >
      {/* Page Title */}
      <h1 className="text-xl font-bold" style={{ color: "var(--color-ink)" }}>
        Dashboard
      </h1>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--color-gray-mid)" }}
          />
          <input
            type="text"
            placeholder="Search anything here..."
            className="pl-9 pr-4 py-2 rounded-xl text-sm transition-all w-64 focus:outline-none"
            style={{
              background: "var(--color-subtle)",
              border: "1px solid var(--color-line)",
              color: "var(--color-gray-dark)",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--color-primary)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--color-line)")
            }
          />
        </div>

        {/* Notifications */}
        <button
          className="relative w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: "var(--color-subtle)",
            color: "var(--color-gray-mid)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--color-line)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--color-subtle)")
          }
        >
          <Bell size={16} />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Admin Profile + Dropdown */}
        <div
          className="relative pl-3 border-l"
          style={{ borderColor: "var(--color-line)" }}
          ref={dropdownRef}
        >
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-xl px-2 py-1 transition-colors"
            style={{ color: "var(--color-ink)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--color-subtle)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ background: "var(--color-primary)" }}
            >
              {getInitials(fullName)}
            </div>

            {/* Name & Role */}
            <div className="hidden md:block text-left">
              <p
                className="text-xs font-bold leading-tight"
                style={{ color: "var(--color-ink)" }}
              >
                {fullName}
              </p>
              <p className="text-xs" style={{ color: "var(--color-gray-mid)" }}>
                {roleLabel}
              </p>
            </div>

            {/* Chevron */}
            <ChevronDown
              size={14}
              className="transition-transform duration-200"
              style={{
                color: "var(--color-gray-mid)",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>

          {/* Dropdown Menu */}
          {open && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-2xl shadow-lg overflow-hidden z-50"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-line)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
              }}
            >
              {/* User info mini header */}
              <div
                className="px-4 py-3 border-b"
                style={{
                  borderColor: "var(--color-line)",
                  background: "var(--color-subtle)",
                }}
              >
                <p
                  className="text-xs font-bold truncate"
                  style={{ color: "var(--color-ink)" }}
                >
                  {fullName}
                </p>
                <p
                  className="text-xs truncate"
                  style={{ color: "var(--color-gray-mid)" }}
                >
                  {roleLabel}
                </p>
              </div>

              {/* Menu items */}
              <div className="py-1.5">
                <DropdownItem
                  icon={<LayoutDashboard size={15} />}
                  label="Back to Home"
                  onClick={() => {
                    setOpen(false);
                    router.push("/")
                  }}
                />
                <DropdownItem
                  icon={<Settings size={15} />}
                  label="Settings"
                  onClick={() => {
                    setOpen(false);
                    router.push("/settings")
                  }}
                />

                {/* Divider */}
                <div
                  className="my-1 mx-3"
                  style={{ height: 1, background: "var(--color-line)" }}
                />

                <DropdownItem
                  icon={<LogOut size={15} />}
                  label="Logout"
                  danger
                  onClick={() => {
                    setOpen(false);
                    // signOut()
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ── Dropdown Item ── */
type DropdownItemProps = {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick?: () => void;
};

function DropdownItem({
  icon,
  label,
  danger = false,
  onClick,
}: DropdownItemProps) {
  const [hovered, setHovered] = useState(false);

  const color = danger
    ? hovered
      ? "#b71c1c"
      : "#e53935"
    : hovered
      ? "var(--color-primary-dark)"
      : "var(--color-gray-dark)";

  const bg = hovered
    ? danger
      ? "#fff5f5"
      : "var(--color-subtle)"
    : "transparent";

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors text-left cursor-pointer"
      style={{ color, background: bg }}
    >
      <span style={{ color }}>{icon}</span>
      {label}
    </button>
  );
}
