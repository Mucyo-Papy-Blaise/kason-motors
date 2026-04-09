// 📁 app/api/testimonials/route.ts

import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

// ─── GET: Fetch all testimonials ──────────────────────────────────────────────
export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("testimonials")
      .select("id, name, role, text, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch testimonials" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}