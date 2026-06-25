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

    if (Number.isNaN(id) || id <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const stockCount = Number(body.stockCount);

    if (Number.isNaN(stockCount) || !Number.isInteger(stockCount) || stockCount < 0) {
      return NextResponse.json(
        { success: false, message: "Invalid stock count" },
        { status: 400 }
      );
    }

    const payload: Record<string, unknown> = {
      stock_count: stockCount,
    };

    const { error } = await supabase.from("cars").update(payload).eq("id", id);

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Stock count updated successfully",
      data: { id, stock_count: stockCount },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
