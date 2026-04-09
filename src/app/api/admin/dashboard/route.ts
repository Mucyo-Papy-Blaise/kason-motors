import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getCurrentUserFromRequest } from "@/lib/auth/session";
import { getAdminDashboardData } from "@/lib/admin-dashboard";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const data = await getAdminDashboardData(user);

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    const status = message === "Forbidden" ? 403 : 500;
    return NextResponse.json(
      { success: false, message },
      { status },
    );
  }
}
