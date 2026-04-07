"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Mail, Clock, Search, Inbox, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      const res = await fetch("/api/notification/readmessage");
      const data = await res.json();
      setMessages(data);
      setLoading(false);
    }
    fetchMessages();
  }, []);

  // Called when admin clicks a message in the list
  async function handleSelect(msg: Message) {
    setSelected(msg);

    // If already read, nothing to do
    if (msg.read) return;

    // Optimistically update local state so UI reflects immediately
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
    );
    // Also update the selected message so the detail panel reflects it
    setSelected({ ...msg, read: true });

    // Persist to database
    await fetch("/api/notification/markread", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: msg.id }),
    });
  }

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Top bar ── */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 shrink-0">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={15} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900 leading-tight">Messages</h1>
          <p className="text-xs text-gray-400">
            {messages.length} total &mdash;{" "}
            <span className="text-red-500 font-semibold">{unreadCount} unread</span>
          </p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar list ── */}
        <aside className="w-full max-w-sm bg-white border-r border-gray-100 flex flex-col shrink-0">
          {/* Search */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {/* List */}
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
                <p className="text-sm">No messages found</p>
              </div>
            ) : (
              filtered.map((msg) => {
                const isUnread = !msg.read;
                const isSelected = selected?.id === msg.id;

                return (
                  <button
                    key={msg.id}
                    onClick={() => handleSelect(msg)}
                    className={`w-full text-left px-4 py-3.5 border-b transition-colors
                      ${isSelected
                        ? "bg-primary/5 border-l-2 border-l-primary border-b-gray-50"
                        : isUnread
                        ? "bg-blue-50/60 border-b-blue-100 hover:bg-blue-50"
                        : "border-b-gray-50 hover:bg-gray-50"
                      }`}
                  >
                    {/* Avatar + name row */}
                    <div className="flex items-center gap-2.5 mb-1">
                      {/* Unread dot */}
                      <div className="relative shrink-0">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                            ${isUnread ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}
                        >
                          {msg.name.charAt(0).toUpperCase()}
                        </div>
                        {isUnread && (
                          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                        )}
                      </div>

                      <span
                        className={`text-sm truncate flex-1
                          ${isUnread ? "font-bold text-gray-900" : "font-medium text-gray-600"}`}
                      >
                        {msg.name}
                      </span>
                      <span
                        className={`text-[10px] shrink-0
                          ${isUnread ? "text-primary font-semibold" : "text-gray-400"}`}
                      >
                        {timeAgo(msg.created_at)}
                      </span>
                    </div>

                    {/* Email */}
                    <p className="text-xs text-gray-400 mb-1 truncate pl-9">{msg.email}</p>

                    {/* Preview */}
                    <p
                      className={`text-xs truncate pl-9
                        ${isUnread ? "text-gray-700 font-medium" : "text-gray-400"}`}
                    >
                      {msg.message}
                    </p>

                    {/* Unread label badge */}
                    {isUnread && (
                      <div className="pl-9 mt-1.5">
                        <span className="inline-block bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                          New
                        </span>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* ── Detail panel ── */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {selected ? (
            <div className="p-8 max-w-2xl w-full">
              {/* Header */}
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-lg font-bold shrink-0">
                  {selected.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
                    {/* Read/unread status badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide
                        ${selected.read
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
                    <Clock size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {new Date(selected.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message body */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Message
                </p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>

              {/* Quick reply button */}
              <div className="mt-6">
                <a
                  href={`mailto:${selected.email}?subject=Re: Your message`}
                  className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-colors shadow-md shadow-primary/20"
                >
                  <Mail size={14} />
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-3">
              <Inbox size={48} strokeWidth={1} />
              <p className="text-base font-medium">Select a message to read</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}