"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Mail,
  Clock,
  Search,
  Inbox,
  ArrowLeft,
  Car,
  Calendar,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type ContactItem = {
  kind: "contact";
  id: string | number;
  name: string;
  email: string;
  phonenumber: string | null;
  message: string;
  created_at: string;
  read: boolean;
};

type TestDriveItem = {
  kind: "test_drive";
  id: number;
  car_id: number;
  car_name: string | null;
  full_name: string;
  email: string;
  phone: string;
  preferred_date: string;
  notes: string | null;
  created_at: string;
  read: boolean;
};

type NotificationItem = ContactItem | TestDriveItem;

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function typeBadge(kind: NotificationItem["kind"]) {
  if (kind === "contact") {
    return (
      <span className="inline-block bg-sky-100 text-sky-800 border border-sky-200/80 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
        Contact
      </span>
    );
  }
  return (
    <span className="inline-block bg-amber-100 text-amber-900 border border-amber-200/80 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
      Test drive
    </span>
  );
}

export default function MessagesPage() {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<NotificationItem | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      const res = await fetch("/api/notification/readmessage");
      if (!res.ok) {
        setItems([]);
        setLoading(false);
        return;
      }
      const data = (await res.json()) as { items?: NotificationItem[] };
      setItems(Array.isArray(data.items) ? data.items : []);
      setLoading(false);
    }
    fetchMessages();

    const channel = supabase
      .channel("admin-notifications-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contacts" },
        () => {
          fetchMessages();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "book_test_driver" },
        () => {
          fetchMessages();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleSelect(item: NotificationItem) {
    setSelected(item);

    if (item.read) return;

    setItems((prev) =>
      prev.map((m) =>
        m.kind === item.kind && m.id === item.id ? { ...m, read: true } : m,
      ),
    );
    setSelected({ ...item, read: true });

    await fetch("/api/notification/markread", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, kind: item.kind }),
    });
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return items;
    return items.filter((m) => {
      if (m.kind === "contact") {
        return (
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
        );
      }
      return (
        m.full_name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        (m.car_name?.toLowerCase().includes(q) ?? false) ||
        (m.notes?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [items, search]);

  const unreadContact = items.filter((m) => m.kind === "contact" && !m.read).length;
  const unreadTestDrive = items.filter(
    (m) => m.kind === "test_drive" && !m.read,
  ).length;
  const unreadTotal = unreadContact + unreadTestDrive;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 shrink-0">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={15} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900 leading-tight">
            Notifications
          </h1>
          <p className="text-xs text-gray-400">
            {items.length} total
            {unreadTotal > 0 ? (
              <>
                {" "}
                —{" "}
                {unreadContact > 0 && (
                  <span className="text-sky-600 font-semibold">
                    {unreadContact} contact
                    {unreadContact !== 1 ? "s" : ""}
                  </span>
                )}
                {unreadContact > 0 && unreadTestDrive > 0 ? (
                  <span className="text-gray-400"> · </span>
                ) : null}
                {unreadTestDrive > 0 && (
                  <span className="text-amber-700 font-semibold">
                    {unreadTestDrive} test drive
                    {unreadTestDrive !== 1 ? "s" : ""}
                  </span>
                )}{" "}
                <span className="text-gray-500">unread</span>
              </>
            ) : null}
          </p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-full max-w-sm bg-white border-r border-gray-100 flex flex-col shrink-0">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notifications..."
                className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="flex flex-col gap-3 p-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                    <div className="h-2 bg-gray-100 rounded w-1/2" />
                    <div className="h-2 bg-gray-100 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
                <Inbox size={28} />
                <p className="text-sm">No notifications found</p>
              </div>
            ) : (
              filtered.map((item) => {
                const isUnread = !item.read;
                const isSelected =
                  selected &&
                  selected.kind === item.kind &&
                  selected.id === item.id;
                const title =
                  item.kind === "contact" ? item.name : item.full_name;
                const subtitle =
                  item.kind === "contact"
                    ? item.email
                    : item.car_name ?? `Car #${item.car_id}`;
                const preview =
                  item.kind === "contact"
                    ? item.message
                    : `Preferred: ${item.preferred_date}${item.notes ? ` · ${item.notes}` : ""}`;

                return (
                  <button
                    key={`${item.kind}-${item.id}`}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className={`w-full text-left px-4 py-3.5 border-b transition-colors
                      ${
                        isSelected
                          ? "bg-primary/5 border-l-2 border-l-primary border-b-gray-50"
                          : isUnread
                            ? item.kind === "test_drive"
                              ? "bg-amber-50/50 border-b-amber-100/60 hover:bg-amber-50/80"
                              : "bg-sky-50/60 border-b-sky-100/60 hover:bg-sky-50"
                            : "border-b-gray-50 hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1">
                      <div className="relative shrink-0">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                            ${
                              isUnread
                                ? item.kind === "test_drive"
                                  ? "bg-amber-500 text-white"
                                  : "bg-sky-600 text-white"
                                : item.kind === "test_drive"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-sky-100 text-sky-800"
                            }`}
                        >
                          {item.kind === "test_drive" ? (
                            <Car size={14} />
                          ) : (
                            title.charAt(0).toUpperCase()
                          )}
                        </div>
                        {isUnread && (
                          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                        )}
                      </div>

                      <span
                        className={`text-sm truncate flex-1
                          ${isUnread ? "font-bold text-gray-900" : "font-medium text-gray-600"}`}
                      >
                        {title}
                      </span>
                      <span
                        className={`text-[10px] shrink-0
                          ${isUnread ? "text-primary font-semibold" : "text-gray-400"}`}
                      >
                        {timeAgo(item.created_at)}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mb-1 truncate pl-9">
                      {subtitle}
                    </p>

                    <p
                      className={`text-xs truncate pl-9
                        ${isUnread ? "text-gray-700 font-medium" : "text-gray-400"}`}
                    >
                      {preview}
                    </p>

                    <div className="pl-9 mt-1.5 flex flex-wrap items-center gap-1.5">
                      {typeBadge(item.kind)}
                      {isUnread && (
                        <span className="inline-block bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                          New
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-y-auto">
          {selected ? (
            selected.kind === "contact" ? (
              <ContactDetail selected={selected} />
            ) : (
              <TestDriveDetail selected={selected} />
            )
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-3">
              <Inbox size={48} strokeWidth={1} />
              <p className="text-base font-medium">
                Select a notification to read
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ContactDetail({ selected }: { selected: ContactItem }) {
  return (
    <div className="p-8 max-w-2xl w-full">
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700 text-lg font-bold shrink-0">
          {selected.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
            {typeBadge("contact")}
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide
                ${
                  selected.read
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-500"
                }`}
            >
              {selected.read ? "Read" : "Unread"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Mail size={12} className="text-gray-400" />
            <a
              href={`mailto:${selected.email}`}
              className="text-sm text-primary hover:underline"
            >
              {selected.email}
            </a>
          </div>
          {selected.phonenumber ? (
            <div className="flex items-center gap-1.5 mt-1">
              <Phone size={12} className="text-gray-400" />
              <a
                href={`tel:${selected.phonenumber}`}
                className="text-sm text-gray-600 hover:text-primary"
              >
                {selected.phonenumber}
              </a>
            </div>
          ) : null}
          <div className="flex items-center gap-1.5 mt-1">
            <Clock size={12} className="text-gray-400" />
            <span className="text-xs text-gray-400">
              {new Date(selected.created_at).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Message
        </p>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {selected.message}
        </p>
      </div>

      <div className="mt-6">
        <a
          href={`mailto:${selected.email}?subject=Re: Your message`}
          className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 hover:bg-primary-dark transition-colors shadow-md shadow-primary/20"
        >
          <Mail size={14} />
          Reply via Email
        </a>
      </div>
    </div>
  );
}

function TestDriveDetail({ selected }: { selected: TestDriveItem }) {
  return (
    <div className="p-8 max-w-2xl w-full">
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
          <Car size={22} />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">
              {selected.full_name}
            </h2>
            {typeBadge("test_drive")}
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide
                ${
                  selected.read
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-500"
                }`}
            >
              {selected.read ? "Read" : "Unread"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Mail size={12} className="text-gray-400" />
            <a
              href={`mailto:${selected.email}`}
              className="text-sm text-primary hover:underline"
            >
              {selected.email}
            </a>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Phone size={12} className="text-gray-400" />
            <a
              href={`tel:${selected.phone}`}
              className="text-sm text-gray-600 hover:text-primary"
            >
              {selected.phone}
            </a>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Calendar size={12} className="text-gray-400" />
            <span className="text-xs text-gray-600">
              Preferred date:{" "}
              <span className="font-semibold text-gray-800">
                {selected.preferred_date}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Clock size={12} className="text-gray-400" />
            <span className="text-xs text-gray-400">
              Submitted {new Date(selected.created_at).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Vehicle
          </p>
          <p className="text-sm font-medium text-gray-900">
            {selected.car_name ?? `Listing #${selected.car_id}`}
          </p>
          <Link
            href={`/inventory/${selected.car_id}`}
            className="inline-flex items-center gap-1.5 text-sm text-primary font-semibold mt-2 hover:underline"
          >
            <Car size={14} />
            View listing
          </Link>
        </div>
        {selected.notes ? (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Notes
            </p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {selected.notes}
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={`mailto:${selected.email}?subject=Re: Test drive request`}
          className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 hover:bg-primary-dark transition-colors shadow-md shadow-primary/20"
        >
          <Mail size={14} />
          Email customer
        </a>
      </div>
    </div>
  );
}
