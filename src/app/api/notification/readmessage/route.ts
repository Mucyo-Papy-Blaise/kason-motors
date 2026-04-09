import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getCurrentUserFromRequest } from "@/lib/auth/session";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export type ContactNotificationRow = {
  kind: "contact";
  id: string | number;
  name: string;
  email: string;
  phonenumber: string | null;
  message: string;
  created_at: string;
  read: boolean;
};

export type TestDriveNotificationRow = {
  kind: "test_drive";
  id: number;
  car_id: number;
  car_name: string | null;
  full_name: string;
  email: string;
  phone: string;
  preferred_date: string;
  notes: string | null;
  created_at: string;
  read: boolean;
};

export type AdminNotificationItem =
  | ContactNotificationRow
  | TestDriveNotificationRow;

export async function GET(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const [contactsRes, bookingsRes] = await Promise.all([
    supabase
      .from("contacts")
      .select("id, name, email, phonenumber, message, created_at, read")
      .order("created_at", { ascending: false }),
    supabase
      .from("book_test_driver")
      .select(
        "id, car_id, full_name, email, phone, preferred_date, notes, created_at, read, cars ( name )",
      )
      .order("created_at", { ascending: false }),
  ]);

  if (contactsRes.error) {
    return NextResponse.json(
      { message: contactsRes.error.message },
      { status: 500 },
    );
  }

  if (bookingsRes.error) {
    return NextResponse.json(
      { message: bookingsRes.error.message },
      { status: 500 },
    );
  }

  const contacts: ContactNotificationRow[] = (contactsRes.data ?? []).map(
    (row) => ({
      kind: "contact" as const,
      id: row.id as string | number,
      name: row.name as string,
      email: row.email as string,
      phonenumber: (row.phonenumber as string | null) ?? null,
      message: row.message as string,
      created_at: row.created_at as string,
      read: Boolean(row.read),
    }),
  );

  type BookingRow = {
    id: number;
    car_id: number;
    full_name: string;
    email: string;
    phone: string;
    preferred_date: string;
    notes: string | null;
    created_at: string;
    read: boolean;
    cars: { name: string | null } | { name: string | null }[] | null;
  };

  const bookings: TestDriveNotificationRow[] = (bookingsRes.data ?? []).map(
    (raw) => {
      const row = raw as unknown as BookingRow;
      const car = Array.isArray(row.cars) ? row.cars[0] : row.cars;
      return {
        kind: "test_drive" as const,
        id: row.id,
        car_id: row.car_id,
        car_name: car?.name ?? null,
        full_name: row.full_name,
        email: row.email,
        phone: row.phone,
        preferred_date: row.preferred_date,
        notes: row.notes,
        created_at: row.created_at,
        read: Boolean(row.read),
      };
    },
  );

  const items: AdminNotificationItem[] = [...contacts, ...bookings].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return NextResponse.json({ items });
}
