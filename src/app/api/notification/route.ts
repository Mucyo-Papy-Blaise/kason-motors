import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { ContactEmail } from "@/lib/email.templete";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // 1. Save to Supabase
    const { error } = await supabase.from("contacts").insert([
      { name, email, message },
    ]);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    // 2. Send email notification to yourself
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.SMTP_USER,
      subject: `New message from ${name}`,
      html:ContactEmail({name,email,message}),
    });

    return NextResponse.json({ success: true, message: "Message saved successfully" }, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}