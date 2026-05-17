import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { token?: unknown; newPassword?: unknown; password?: unknown }
      | null;

    const token = typeof body?.token === "string" ? body.token.trim() : "";
    const newPassword =
      typeof body?.newPassword === "string"
        ? body.newPassword
        : typeof body?.password === "string"
          ? body.password
          : "";

    if (!token || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Token and a password with at least 6 characters are required" },
        { status: 400 },
      );
    }

    const { data: user, error: findError } = await supabase
      .from("profiles")
      .select("id, reset_token_expiry")
      .eq("reset_token", token)
      .maybeSingle();

    if (findError) {
      console.error("Reset password lookup failed:", findError);
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    if (!user || !user.reset_token_expiry) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    if (new Date(user.reset_token_expiry).getTime() <= Date.now()) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword },
    );

    if (authUpdateError) {
      console.error("Reset password auth update failed:", authUpdateError);
      return NextResponse.json(
        { error: "Failed to reset password" },
        { status: 500 },
      );
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        reset_token: null,
        reset_token_expiry: null,
      })
      .eq("id", user.id)
      .eq("reset_token", token);

    if (updateError) {
      console.error("Reset password update failed:", updateError);
      return NextResponse.json(
        { error: "Failed to reset password" },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password request failed:", error);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
