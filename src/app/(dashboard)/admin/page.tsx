import QuickStats from "@/components/dashboard/QuickStats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import RecentCarsTable from "@/components/dashboard/RecentCarsTable";
import { getAdminDashboardData } from "@/lib/admin-dashboard";
import { requireAdminUser } from "@/lib/auth/session";

export default async function AdminDashboard() {
  const currentUser = await requireAdminUser();
  const dashboard = await getAdminDashboardData(currentUser);

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

      <QuickStats stats={dashboard.stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentCarsTable cars={dashboard.recentCars} />
        </div>

        <RecentActivity items={dashboard.activity} />
      </div>
    </div>
  );
}
