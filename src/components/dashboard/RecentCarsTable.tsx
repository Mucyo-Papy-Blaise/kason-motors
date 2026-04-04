import { MoreHorizontal, Eye } from "lucide-react";
import { cars } from "@/lib/mockData";
import Image from "next/image";

const statusMap: Record<string, string> = {
  "Best Seller": "bg-green-50 text-green-600",
  "New Arrival": "bg-blue-50 text-blue-600",
  Popular: "bg-purple-50 text-purple-600",
  Luxury: "bg-amber-50 text-amber-600",
  Used: "bg-gray-100 text-gray-500",
};

export default function RecentCarsTable() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900">Recent Listings</h3>
        <button className="text-xs font-semibold text-primary hover:underline">
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              {["Car", "Type", "Year", "Price", "Status", ""].map((h) => (
                <th
                  key={h}
                  className="text-left px-6 py-3 text-xs font-bold text-gray-400 tracking-widest uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr
                key={car.id}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
              >
                {/* Car */}
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-9 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <Image
                        src={car.image}
                        alt={car.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {car.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-sm text-gray-500">
                  {car.type}
                </td>
                <td className="px-6 py-3.5 text-sm text-gray-500">
                  {car.year}
                </td>
                <td className="px-6 py-3.5 text-sm font-bold text-gray-900">
                  ${car.price.toLocaleString()}
                </td>
                <td className="px-6 py-3.5">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusMap[car.badge] || "bg-gray-100 text-gray-500"}`}
                  >
                    {car.badge}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors">
                      <Eye size={14} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
