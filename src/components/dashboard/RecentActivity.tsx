import { Car, Clock, Mail, Users } from "lucide-react";
import type { DashboardActivity } from "@/lib/admin-dashboard";

const toneClass: Record<DashboardActivity["tone"], string> = {
  primary: "bg-primary/15 text-primary",
  blue: "bg-blue-50 text-blue-500",
  green: "bg-green-50 text-green-600",
  amber: "bg-amber-50 text-amber-600",
  purple: "bg-purple-50 text-purple-600",
};

const iconMap = {
  car: Car,
  users: Users,
  mail: Mail,
};

type RecentActivityProps = {
  items: DashboardActivity[];
};

export default function RecentActivity({ items }: RecentActivityProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Recent Activity</h3>
        <Clock size={15} className="text-gray-400" />
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">
          No recent listings, sign-ups, or contact messages yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <div key={item.id} className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${toneClass[item.tone]}`}
                >
                  <Icon size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium leading-tight text-gray-700">
                    {item.text}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">{item.timeLabel}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
