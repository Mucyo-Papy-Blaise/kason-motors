import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { getCurrentUserFromRequest } from "@/lib/auth/session";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

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
      .select("*", { count: "exact", head: true })
      .eq("read", false),
    supabase
      .from("book_test_driver")
      .select("*", { count: "exact", head: true })
      .eq("read", false),
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

  const contactUnread = contactsRes.count ?? 0;
  const testDriveUnread = bookingsRes.count ?? 0;

  return NextResponse.json({
    contactUnread,
    testDriveUnread,
    total: contactUnread + testDriveUnread,
  });
}
