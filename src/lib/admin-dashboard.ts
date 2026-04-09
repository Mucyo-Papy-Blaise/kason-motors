import { getSupabaseServiceRoleClient } from "@/lib/supabase-server";
import type { CurrentUser } from "@/types/auth";

export type DashboardStats = {
  totalCars: number;
  inventoryValueRwf: number;
  totalCustomers: number;
  listedThisMonth: number;
  listedPrevMonth: number;
  newCustomersThisMonth: number;
  newCustomersPrevMonth: number;
};

export type DashboardRecentCar = {
  id: number;
  name: string;
  bodyType: string;
  year: number;
  price: number;
  badge: string | null;
  imageUrl: string | null;
};

export type DashboardActivity = {
  id: string;
  text: string;
  timeLabel: string;
  icon: "car" | "users" | "mail";
  tone: "primary" | "blue" | "green" | "amber" | "purple";
};

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

function addMonths(d: Date, n: number): Date {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
}

function formatRelative(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const sec = Math.floor((Date.now() - t) / 1000);
  if (sec < 45) return "just now";
  if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} hr ago`;
  if (sec < 86400 * 7) return `${Math.floor(sec / 86400)} days ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

type CarRow = {
  id: number;
  name: string | null;
  title: string | null;
  brand: string | null;
  model: string | null;
  body_type: string | null;
  type: string | null;
  year: number | null;
  price: number | null;
  badge: string | null;
  image: string | null;
  image_urls: unknown;
  created_at: string | null;
};

function pickCarName(row: CarRow): string {
  const t = (row.title || "").trim();
  if (t) return t;
  const n = (row.name || "").trim();
  if (n) return n;
  const b = (row.brand || "").trim();
  const m = (row.model || "").trim();
  if (b || m) return `${b} ${m}`.trim();
  return "Vehicle";
}

function pickImage(row: CarRow): string | null {
  const urls = row.image_urls;
  if (Array.isArray(urls) && urls.length > 0 && typeof urls[0] === "string") {
    return urls[0];
  }
  return row.image || null;
}

export async function getAdminDashboardData(
  user: CurrentUser,
): Promise<{
  stats: DashboardStats;
  recentCars: DashboardRecentCar[];
  activity: DashboardActivity[];
}> {
  if (user.role !== "admin") {
    throw new Error("Forbidden");
  }

  const supabase = getSupabaseServiceRoleClient();
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const prevMonthStart = startOfMonth(addMonths(now, -1));
  const prevMonthEnd = new Date(thisMonthStart.getTime() - 1);

  const [
    carsRes,
    profilesCountRes,
    profilesThisRes,
    profilesPrevRes,
    listedThisRes,
    listedPrevRes,
    recentCarsRes,
    recentProfilesRes,
    recentMessagesRes,
  ] = await Promise.all([
    supabase.from("cars").select("price, created_at"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "user"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "user")
      .gte("created_at", thisMonthStart.toISOString()),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "user")
      .gte("created_at", prevMonthStart.toISOString())
      .lte("created_at", prevMonthEnd.toISOString()),
    supabase
      .from("cars")
      .select("*", { count: "exact", head: true })
      .gte("created_at", thisMonthStart.toISOString()),
    supabase
      .from("cars")
      .select("*", { count: "exact", head: true })
      .gte("created_at", prevMonthStart.toISOString())
      .lte("created_at", prevMonthEnd.toISOString()),
    supabase
      .from("cars")
      .select("*")
      .order("created_at", { ascending: false, nullsFirst: false })
      .order("id", { ascending: false })
      .limit(8),
    supabase
      .from("profiles")
      .select("full_name, created_at")
      .eq("role", "user")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("messages")
      .select("name, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  if (carsRes.error) {
    console.error("[admin-dashboard] cars:", carsRes.error.message);
  }
  if (recentCarsRes.error) {
    console.error("[admin-dashboard] recent cars:", recentCarsRes.error.message);
  }

  const priceRows = (carsRes.data ?? []) as { price: number | null }[];
  const totalCars = priceRows.length;
  const inventoryValueRwf = priceRows.reduce(
    (s, r) => s + (Number(r.price) || 0),
    0,
  );

  const totalCustomers = profilesCountRes.count ?? 0;
  const newCustomersThisMonth = profilesThisRes.count ?? 0;
  const newCustomersPrevMonth = profilesPrevRes.count ?? 0;
  const listedThisMonth = listedThisRes.count ?? 0;
  const listedPrevMonth = listedPrevRes.count ?? 0;

  const rawCars = (recentCarsRes.error ? [] : recentCarsRes.data ?? []) as unknown as CarRow[];
  const recentCars: DashboardRecentCar[] = rawCars.map((row) => ({
    id: row.id,
    name: pickCarName(row),
    bodyType: (row.body_type || row.type || "—").trim() || "—",
    year: Number(row.year) || 0,
    price: Number(row.price) || 0,
    badge: row.badge,
    imageUrl: pickImage(row),
  }));

  type ActivityRow = { sort: number; item: DashboardActivity };

  const activityRows: ActivityRow[] = [
    ...rawCars.slice(0, 5).map((row) => ({
      sort: row.created_at
        ? new Date(row.created_at).getTime()
        : Number(row.id),
      item: {
        id: `car-${row.id}`,
        text: `New listing: ${pickCarName(row)}`,
        timeLabel: row.created_at ? formatRelative(row.created_at) : "",
        icon: "car" as const,
        tone: "primary" as const,
      },
    })),
    ...(recentProfilesRes.error ? [] : recentProfilesRes.data ?? []).map(
      (row) => {
        const p = row as { full_name: string; created_at: string };
        return {
          sort: new Date(p.created_at).getTime(),
          item: {
            id: `profile-${p.created_at}`,
            text: `New customer: ${p.full_name}`,
            timeLabel: formatRelative(p.created_at),
            icon: "users" as const,
            tone: "green" as const,
          },
        };
      },
    ),
    ...(recentMessagesRes.error ? [] : recentMessagesRes.data ?? []).map(
      (row) => {
        const m = row as { name: string; created_at: string };
        return {
          sort: new Date(m.created_at).getTime(),
          item: {
            id: `msg-${m.created_at}-${m.name}`,
            text: `Contact inquiry from ${m.name}`,
            timeLabel: formatRelative(m.created_at),
            icon: "mail" as const,
            tone: "amber" as const,
          },
        };
      },
    ),
  ];

  const activityFeed: DashboardActivity[] = activityRows
    .sort((a, b) => b.sort - a.sort)
    .slice(0, 8)
    .map((x) => x.item)
    .filter((x) => x.timeLabel);

  return {
    stats: {
      totalCars,
      inventoryValueRwf,
      totalCustomers,
      listedThisMonth,
      listedPrevMonth,
      newCustomersThisMonth,
      newCustomersPrevMonth,
    },
    recentCars,
    activity: activityFeed,
  };
}
