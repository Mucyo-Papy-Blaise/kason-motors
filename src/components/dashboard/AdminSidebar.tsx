"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Upload,
  List,
Plus,
  BarChart2,
  Settings,
  LogOut,
  ChevronRight,
  Eye,
  Wrench,
  Star,
  Bell,
  HelpCircle,
  Gauge,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type AdminSidebarProps = {
  fullName: string;
};

const menuGroups = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        badge: null,
      },
    ],
  },
  {
    label: "Vehicles",
    items: [
      {
        label: "All Listings",
        href: "/admin/listings",
        icon: List,
        badge: null,
      },
      {
        label: "Upload Vehicle",
        href: "/admin/listings/upload",
        icon: Plus,
        badge: "New",
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        label: "Notifications",
        href: "/admin/notification",
        icon: Bell,
        badge: null as string | null,
      },
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
        badge: null,
      },
    ],
  },
];

export default function AdminSidebar({ fullName }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notificationUnread, setNotificationUnread] = useState(0);

  const fetchNotificationUnread = useCallback(async () => {
    const res = await fetch("/api/admin/notifications/unread");
    if (!res.ok) return;
    const data = (await res.json()) as { total?: number };
    setNotificationUnread(typeof data.total === "number" ? data.total : 0);
  }, []);

  useEffect(() => {
    fetchNotificationUnread();

    const channel = supabase
      .channel("sidebar-notification-unread")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contacts" },
        () => fetchNotificationUnread(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "book_test_driver" },
        () => fetchNotificationUnread(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchNotificationUnread]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <style>{`
        .sidebar-nav::-webkit-scrollbar { width: 3px; }
        .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
        .sidebar-nav::-webkit-scrollbar-thumb { background: #E0E0E0; border-radius: 99px; }
        .sidebar-nav::-webkit-scrollbar-thumb:hover { background: #4CAF50; }
        .sidebar-nav { scrollbar-width: thin; scrollbar-color: #E0E0E0 transparent; }
      `}</style>

      <div className="relative h-full flex shrink-0">
        <motion.aside
          animate={{ width: collapsed ? 68 : 236 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="h-full flex flex-col overflow-hidden bg-white border-r border-gray-dark/30"
        >
          {/* Top primary accent bar */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary z-10" />

          {/* Logo */}
          <div className="flex items-center gap-3 px-4 pt-6 pb-5 shrink-0 border-b border-gray-dark/30">
            <div className="relative shrink-0">
              <Image
                src="/logo.jpeg"
                alt="Kason Motors"
                width={34}
                height={34}
                className="rounded-xl object-cover"
                style={{ width: 34, height: 34 }}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-primary-light" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                >
                <Link href='/'>
                <p className="font-bold text-sm tracking-tight leading-none text-gray-dark ">
                    KASON <span className="text-primary">MOTORS</span>
                  </p>
                  <p className="text-[11px] mt-0.5 font-medium text-gray-mid">
                    Admin Console
                  </p>
                </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Nav */}
          <nav className="sidebar-nav flex-1 overflow-y-auto py-4 px-2.5 space-y-5">
            {menuGroups.map((group) => (
              <div key={group.label}>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-[10px] font-bold tracking-[0.12em] uppercase px-2 mb-1.5 text-gray-mid"
                    >
                      {group.label}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={`flex items-center gap-3 px-2.5 py-2.5 text-[13px] font-medium transition-all duration-150 group
                          ${
                            isActive
                              ? "bg-primary text-white"
                              : "text-gray-dark hover:bg-gray-light hover:text-primary"
                          }`}
                      >
                        <Icon
                          size={16}
                          className={`shrink-0 transition-colors duration-150
                            ${
                              isActive
                                ? "text-white"
                                : "text-gray-mid group-hover:text-primary"
                            }`}
                        />

                        <AnimatePresence>
                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="flex-1 whitespace-nowrap"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        {!collapsed &&
                          (item.href === "/admin/notification"
                            ? notificationUnread > 0
                            : Boolean(item.badge)) && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none
                              ${
                                item.href === "/admin/notification"
                                  ? "bg-violet-500/10 text-violet-700 border border-violet-500/25"
                                  : item.badge === "New"
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "bg-red-500/10 text-red-500 border border-red-500/20"
                              }`}
                            >
                              {item.href === "/admin/notification"
                                ? notificationUnread > 99
                                  ? "99+"
                                  : String(notificationUnread)
                                : item.badge}
                            </motion.span>
                          )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User + Logout */}
          <div className="px-2.5 py-3 shrink-0 border-t border-gray-dark/30">
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2.5 px-2.5 py-2 mb-1 rounded-xl bg-gray-light"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate leading-none text-primary">
                      {fullName}
                    </p>
                    <p className="text-[10px] mt-0.5 font-medium text-gray-mid">
                      Administrator
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              title={collapsed ? "Log Out" : undefined}
              className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-[13px] font-medium w-full transition-all duration-150 text-gray-mid hover:bg-red-50 hover:text-red-500 group"
            >
              <LogOut
                size={15}
                className="shrink-0 group-hover:text-red-500 transition-colors"
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    {isLoggingOut ? "Signing out..." : "Log Out"}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.aside>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-6.5 -right-3.5 w-7 h-7 rounded-full flex items-center justify-center z-20 shadow-md bg-white border border-gray-dark/30 text-gray-mid hover:border-primary hover:text-primary transition-all duration-150"
        >
          <motion.div
            animate={{ rotate: collapsed ? 0 : 180 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronRight size={13} />
          </motion.div>
        </button>
      </div>
    </>
  );
}
