import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getCurrentUserFromRequest } from "@/lib/auth/session";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    id?: unknown;
    kind?: unknown;
  };

  const kind = body.kind === "test_drive" ? "test_drive" : "contact";

  const rawId = body.id;
  const id =
    kind === "test_drive"
      ? typeof rawId === "number"
        ? rawId
        : typeof rawId === "string"
          ? Number(rawId)
          : NaN
      : rawId;

  if (kind === "test_drive") {
    if (!Number.isFinite(id as number)) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 },
      );
    }
  } else if (typeof id !== "string" && typeof id !== "number") {
    return NextResponse.json({ error: "Message ID is required" }, { status: 400 });
  }

  const table = kind === "test_drive" ? "book_test_driver" : "contacts";

  const { error } = await supabase
    .from(table)
    .update({ read: true })
    .eq("id", id as string | number);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
