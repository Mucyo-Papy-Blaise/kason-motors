"use client";
import { useEffect, useState, useCallback } from "react";
import { Bell, Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

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
  const router = useRouter();
  const [unreadTotal, setUnreadTotal] = useState(0);

  const fetchUnread = useCallback(async () => {
    const res = await fetch("/api/admin/notifications/unread");
    if (!res.ok) return;
    const data = (await res.json()) as { total?: number };
    setUnreadTotal(typeof data.total === "number" ? data.total : 0);
  }, []);

  useEffect(() => {
    fetchUnread();

    const channel = supabase
      .channel("topbar-unread")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contacts" },
        () => fetchUnread(),
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "contacts" },
        () => fetchUnread(),
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "book_test_driver" },
        () => fetchUnread(),
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "book_test_driver" },
        () => fetchUnread(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchUnread]);

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between shrink-0">
      <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search anything here..."
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:border-primary w-64 transition-all"
          />
        </div>

        <button
          type="button"
          className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-dark transition-colors shadow-md shadow-primary/20"
        >
          <Plus size={16} />
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/notification")}
          className="relative w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          title="View notifications"
        >
          <Bell size={16} />
          {unreadTotal > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold px-0.5">
              {unreadTotal > 99 ? "99+" : unreadTotal}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs">
            {getInitials(fullName)}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-bold text-gray-900 leading-tight">
              {fullName}
            </p>
            <p className="text-xs text-gray-400">{roleLabel}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
