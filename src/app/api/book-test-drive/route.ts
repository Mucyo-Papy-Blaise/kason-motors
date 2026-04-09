import { z } from "zod";
import { NextResponse } from "next/server";

import { getSupabaseServiceRoleClient } from "@/lib/supabase-server";

const bodySchema = z.object({
  carId: z.number().int().positive(),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .regex(/^[+\d\s\-()]+$/, "Enter a valid phone number"),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  notes: z.string().max(2000).optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      const first = parsed.error.flatten().fieldErrors;
      const msg =
        Object.values(first).flat()[0] ?? "Invalid request";
      return NextResponse.json({ success: false, message: msg }, { status: 400 });
    }

    const { carId, fullName, email, phone, preferredDate, notes } = parsed.data;

    const parts = preferredDate.split("-").map(Number);
    if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
      return NextResponse.json(
        { success: false, message: "Invalid date" },
        { status: 400 },
      );
    }
    const [py, pm, pd] = parts;
    const preferred = new Date(py, pm - 1, pd);
    preferred.setHours(0, 0, 0, 0);
    if (Number.isNaN(preferred.getTime())) {
      return NextResponse.json(
        { success: false, message: "Invalid date" },
        { status: 400 },
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (preferred < today) {
      return NextResponse.json(
        { success: false, message: "Preferred date must be today or later" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServiceRoleClient();

    const { data: car, error: carError } = await supabase
      .from("cars")
      .select("id")
      .eq("id", carId)
      .maybeSingle();

    if (carError) {
      return NextResponse.json(
        { success: false, message: carError.message },
        { status: 500 },
      );
    }

    if (!car) {
      return NextResponse.json(
        { success: false, message: "Vehicle not found" },
        { status: 404 },
      );
    }

    const { error: insertError } = await supabase.from("book_test_driver").insert({
      car_id: carId,
      full_name: fullName,
      email,
      phone,
      preferred_date: preferredDate,
      notes: notes?.trim() || null,
    });

    if (insertError) {
      return NextResponse.json(
        { success: false, message: insertError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
