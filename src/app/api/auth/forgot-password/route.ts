import crypto from "crypto";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SUCCESS_MESSAGE = "If email exists, reset link sent";
const TOKEN_TTL_MS = 15 * 60 * 1000;

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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const getSuccessResponse = () => NextResponse.json({ message: SUCCESS_MESSAGE });

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { email?: unknown }
      | null;
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return getSuccessResponse();
    }

    const { data: user, error: findError } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (findError) {
      console.error("Forgot password lookup failed:", findError);
      return getSuccessResponse();
    }

    if (!user) {
      return getSuccessResponse();
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + TOKEN_TTL_MS).toISOString();

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        reset_token: token,
        reset_token_expiry: expiry,
      })
      .eq("email", email);

    if (updateError) {
      console.error("Forgot password token save failed:", updateError);
      return getSuccessResponse();
    }

    const resetLink = `http://localhost:3000/NewPassword?token=${encodeURIComponent(token)}`;
console.log(resetLink)
    const html = `
      <p>You requested a password reset.</p>
      <p>
        Click the link below to reset your password:
      </p>
      <p>
        <a href="${resetLink}">${resetLink}</a>
      </p>
      <p>This link expires in 15 minutes.</p>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject: "Password Reset",
      html,
    });

    return getSuccessResponse();
  } catch (error) {
    console.error("Forgot password request failed:", error);
    return getSuccessResponse();
  }
}
