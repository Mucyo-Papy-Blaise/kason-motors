import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();

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

    // Check required fields
    if (!name || !category || !type) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Convert numbers safely
    const parsedPrice = Number(price);
    const parsedYear = Number(year);
    const parsedMileage = Number(mileage);

    if (isNaN(parsedPrice) || isNaN(parsedYear) || isNaN(parsedMileage)) {
      return NextResponse.json(
        {
          success: false,
          message: "Price, year and mileage must be numbers",
        },
        { status: 400 }
      );
    }

    // ✅ Insert into Supabase (FIXED ERROR HERE)
    const { data, error } = await supabase
      .from("cars")
      .insert([
        {
          name,
          category,
          type,
          price: parsedPrice,
          year: parsedYear,
          mileage: parsedMileage,
          fuel,
          transmission,
          image,
          badge,
        },
      ] as any); 
    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}