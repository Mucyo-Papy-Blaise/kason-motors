import { getSupabaseServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase.from("cars").select("*");

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    const normalizedCars = (data ?? []).map((car) => ({
      ...car,
      fullOption: Boolean(car.full_option),
    }));

    return NextResponse.json({
      success: true,
      data: normalizedCars,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
