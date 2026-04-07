import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { vehicleFormSchema } from "@/lib/vehicleFormSchema";

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    const body = await req.json();
    const parsed = vehicleFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.flatten().formErrors[0] ?? "Invalid payload" },
        { status: 400 }
      );
    }

    const payloadData = parsed.data;

    const payload: Record<string, unknown> = {
      title: payloadData.title,
      brand: payloadData.brand,
      model: payloadData.model,
      year: Number(payloadData.year),
      condition: payloadData.condition,
      body_type: payloadData.bodyType,
      mileage: Number(payloadData.mileage.replace(/,/g, "")),
      engine_size: payloadData.engineSize,
      fuel: payloadData.fuel,
      transmission: payloadData.transmission,
      drive_type: payloadData.driveType,
      horsepower: payloadData.horsepower ? Number(payloadData.horsepower) : null,
      exterior_color: payloadData.exteriorColor || null,
      interior_color: payloadData.interiorColor || null,
      doors: payloadData.doors ? Number(payloadData.doors) : null,
      seats: payloadData.seats ? Number(payloadData.seats) : null,
      price: Number(payloadData.price),
      negotiable: payloadData.negotiable,
      description: payloadData.description,
      image: payloadData.image,
      image_urls: payloadData.imageUrls,
      video_url: payloadData.videoUrl || null,
      features: payloadData.features ?? [],
      badge: payloadData.badge || null,
      // Backward compatibility for older UI fragments.
      name: payloadData.title,
      category: payloadData.brand,
      type: payloadData.bodyType,
    };

    const { data, error } = await supabase
      .from("cars")
      .insert([payload])
      .select("*")
      .single();

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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
