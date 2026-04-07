import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function PATCH(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Message ID is required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("contacts")
    .update({ read: true })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}