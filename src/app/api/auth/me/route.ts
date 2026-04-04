import { NextResponse } from "next/server";

import { getCurrentUserFromRequest } from "@/lib/auth/session";

export async function GET(request: import("next/server").NextRequest) {
  const user = await getCurrentUserFromRequest(request);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  return NextResponse.json({ user });
}
