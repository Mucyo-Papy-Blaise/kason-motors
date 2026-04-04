"use client";
import { motion } from "framer-motion";
import { Car, Users, DollarSign, TrendingUp } from "lucide-react";
import StatsCard from "./StatsCard";

const stats = [
  {
    title: "Total Revenue",
    value: "$124,500",
    change: "+12.5%",
    positive: true,
    icon: DollarSign,
    color: "bg-primary",
  },
  {
    title: "Cars Available",
    value: "128",
    change: "+4 new",
    positive: true,
    icon: Car,
    color: "bg-blue-500",
  },
  {
    title: "Total Customers",
    value: "2,048",
    change: "+8.2%",
    positive: true,
    icon: Users,
    color: "bg-purple-500",
  },
  {
    title: "Monthly Sales",
    value: "38",
    change: "-2.1%",
    positive: false,
    icon: TrendingUp,
    color: "bg-amber-500",
  },
];

export default function QuickStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
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
