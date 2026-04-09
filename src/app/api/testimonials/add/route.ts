// 📁 app/api/testimonials/add/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceRoleClient } from "@/lib/supabase-server";

// ─── POST: Save a new testimonial ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseServiceRoleClient();

    // ── Parse body ────────────────────────────────────────────────────────
    const body = await req.json();
    const { name, role, text } = body;

    // ── Validate input ─────────────────────────────────────────────────────
    if (!name || !role || !text) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // ── Insert into database ──────────────────────────────────────────────
    const { data, error } = await supabase
      .from("testimonials")
      .insert([
        {
          name: name.trim(),
          role: role.trim(),
          text: text.trim(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    // ── Success response ───────────────────────────────────────────────────
    return NextResponse.json(
      {
        success: true,
        message: "Testimonial saved successfully",
        data,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}