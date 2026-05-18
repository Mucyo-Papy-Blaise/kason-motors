import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
    const {
      name,
      phone,
      email,
      vehicleModel,
      licensePlate,
      requestSummary,
      needsInsurance,
      insurance,
      insurancePolicyNumber,
    } = body;

    if (!name || !phone || !requestSummary) {
      return NextResponse.json(
        { success: false, message: "Name, phone, and request summary are required." },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("maintenance_requests").insert([
      {
        name,
        phone,
        email: email || null,
        vehicle_model: vehicleModel || null,
        license_plate: licensePlate || null,
        request_summary: requestSummary,
        needs_insurance: needsInsurance ?? false,
        insurance: needsInsurance ? insurance || null : null,
        insurance_policy_number: needsInsurance ? insurancePolicyNumber || null : null,
        read: false,
      },
    ]);

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 },
      );
    }

    // Send email notification to admin
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.SMTP_USER,
      subject: `New Maintenance Request from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Maintenance Request</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold;">Name</td><td style="padding: 8px;">${name}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Phone</td><td style="padding: 8px;">${phone}</td></tr>
            ${email ? `<tr><td style="padding: 8px; font-weight: bold;">Email</td><td style="padding: 8px;">${email}</td></tr>` : ""}
            ${vehicleModel ? `<tr><td style="padding: 8px; font-weight: bold;">Vehicle</td><td style="padding: 8px;">${vehicleModel}</td></tr>` : ""}
            ${licensePlate ? `<tr><td style="padding: 8px; font-weight: bold;">Plate</td><td style="padding: 8px;">${licensePlate}</td></tr>` : ""}
            <tr><td style="padding: 8px; font-weight: bold;">Request</td><td style="padding: 8px;">${requestSummary}</td></tr>
            ${needsInsurance ? `<tr><td style="padding: 8px; font-weight: bold;">Insurance</td><td style="padding: 8px;">${insurance ?? "-"} (Policy: ${insurancePolicyNumber ?? "-"})</td></tr>` : ""}
          </table>
        </div>
      `,
    });

    return NextResponse.json(
      { success: true, message: "Maintenance request submitted successfully." },
      { status: 201 },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}