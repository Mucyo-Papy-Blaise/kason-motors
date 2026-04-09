import { MoreHorizontal, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { DashboardRecentCar } from "@/lib/admin-dashboard";

const statusMap: Record<string, string> = {
  "Best Seller": "bg-green-50 text-green-600",
  "New Arrival": "bg-blue-50 text-blue-600",
  Popular: "bg-purple-50 text-purple-600",
  Luxury: "bg-amber-50 text-amber-600",
  Used: "bg-gray-100 text-gray-500",
};

function formatRwf(n: number) {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0,
  }).format(n);
}

type RecentCarsTableProps = {
  cars: DashboardRecentCar[];
};

export default function RecentCarsTable({ cars }: RecentCarsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h3 className="font-bold text-gray-900">Recent Listings</h3>
        <Link
          href="/admin/listings"
          className="text-xs font-semibold text-primary hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              {["Car", "Type", "Year", "Price", "Status", ""].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cars.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  No vehicles yet. Add listings from the admin section.
                </td>
              </tr>
            ) : (
              cars.map((car) => (
                <tr
                  key={car.id}
                  className="group border-b border-gray-50 transition-colors hover:bg-gray-50/50"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {car.imageUrl ? (
                          <Image
                            src={car.imageUrl}
                            alt={car.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                            —
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {car.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-500">
                    {car.bodyType}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-500">
                    {car.year || "—"}
                  </td>
                  <td className="px-6 py-3.5 text-sm font-bold text-gray-900">
                    {formatRwf(car.price)}
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${car.badge ? statusMap[car.badge] || "bg-gray-100 text-gray-500" : "bg-gray-100 text-gray-500"}`}
                    >
                      {car.badge || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Link
                        href={`/inventory/${car.id}`}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-primary"
                        aria-label="View on site"
                      >
                        <Eye size={14} />
                      </Link>
                      <Link
                        href={`/admin/listings/${car.id}/edit`}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100"
                        aria-label="Edit listing"
                      >
                        <MoreHorizontal size={14} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
