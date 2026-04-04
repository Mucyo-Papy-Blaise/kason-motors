"use client";
import { Bell, Search, Plus } from "lucide-react";

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

export default function AdminTopbar({
  fullName,
  roleLabel,
}: AdminTopbarProps) {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between shrink-0">
      {/* Page Title */}
      <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Search */}
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

        {/* Add Button */}
        <button className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-dark transition-colors shadow-md shadow-primary/20">
          <Plus size={16} />
        </button>

        {/* Notifications */}
        <button className="relative w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell size={16} />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Admin Profile */}
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
