"use client";

import { motion } from "framer-motion";
import { Car, DollarSign, Users, TrendingUp } from "lucide-react";
import type { DashboardStats } from "@/lib/admin-dashboard";
import StatsCard from "./StatsCard";

function pctMoM(current: number, previous: number): {
  text: string;
  positive: boolean;
} {
  if (previous === 0) {
    return current > 0
      ? { text: `+${current}`, positive: true }
      : { text: "—", positive: true };
  }
  const pct = ((current - previous) / previous) * 100;
  return {
    text: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`,
    positive: pct >= 0,
  };
}

function formatRwf(n: number) {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0,
  }).format(n);
}

type QuickStatsProps = {
  stats: DashboardStats;
};

export default function QuickStats({ stats }: QuickStatsProps) {
  const listingTrend = pctMoM(stats.listedThisMonth, stats.listedPrevMonth);
  const customerTrend = pctMoM(
    stats.newCustomersThisMonth,
    stats.newCustomersPrevMonth,
  );

  const cards = [
    {
      title: "Inventory value",
      value: formatRwf(stats.inventoryValueRwf),
      change: "Est. from list prices",
      positive: true,
      icon: DollarSign,
      color: "bg-primary",
    },
    {
      title: "Cars in stock",
      value: String(stats.totalCars),
      change: `${listingTrend.text} vs last month`,
      positive: listingTrend.positive,
      icon: Car,
      color: "bg-blue-500",
    },
    {
      title: "Registered customers",
      value: String(stats.totalCustomers),
      change: `${customerTrend.text} MoM`,
      positive: customerTrend.positive,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "New listings (this month)",
      value: String(stats.listedThisMonth),
      change: `${stats.listedPrevMonth} in prior month`,
      positive: stats.listedThisMonth >= stats.listedPrevMonth,
      icon: TrendingUp,
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat, i) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <StatsCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
}
