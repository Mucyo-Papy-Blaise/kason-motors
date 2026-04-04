import QuickStats from "@/components/dashboard/QuickStats";
import RecentCarsTable from "@/components/dashboard/RecentCarsTable";
import { requireAdminUser } from "@/lib/auth/session";
import { Car, Users, Clock } from "lucide-react";

const recentActivity = [
  {
    icon: Car,
    text: "New car listed: BMW X5 2023",
    time: "2 min ago",
    color: "bg-blue-50 text-blue-500",
  },
  {
    icon: Users,
    text: "New customer: Jean Pierre",
    time: "15 min ago",
    color: "bg-green-50 text-green-500",
  },
  {
    icon: Car,
    text: "Car sold: Toyota Land Cruiser",
    time: "1 hr ago",
    color: "bg-amber-50 text-amber-500",
  },
  {
    icon: Users,
    text: "New customer: Marie Claire",
    time: "2 hr ago",
    color: "bg-purple-50 text-purple-500",
  },
];

export default async function AdminDashboard() {
  const currentUser = await requireAdminUser();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {currentUser.fullName}
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Here&apos;s what&apos;s happening with Kason Motors today.
        </p>
      </div>

      <QuickStats />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentCarsTable />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Recent Activity</h3>
            <Clock size={15} className="text-gray-400" />
          </div>
          <div className="flex flex-col gap-4">
            {recentActivity.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                  >
                    <Icon size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-tight text-gray-700">
                      {item.text}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
