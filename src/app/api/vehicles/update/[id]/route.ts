import { getSupabaseServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseServerClient();

    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id) || id <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const {
      name,
      category,
      type,
      price,
      year,
      mileage,
      fuel,
      transmission,
      image,
      badge,
    } = body;

    const { error } = await supabase
      .from("cars")
      .update({
        name,
        category,
        type,
        price: Number(price),
        year: Number(year),
        mileage: Number(mileage),
        fuel,
        transmission,
        image,
        badge,
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Car updated successfully",
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}