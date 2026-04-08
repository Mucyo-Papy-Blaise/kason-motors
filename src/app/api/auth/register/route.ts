import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

interface RegisterRequestBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const isValidRegisterPayload = (value: unknown): value is RegisterRequestBody => {
  if (!value || typeof value !== "object") return false;
  const { email, password, firstName, lastName } = value as Record<string, unknown>;
  return (
    typeof email === "string" && email.length > 0 &&
    typeof password === "string" && password.length >= 6 &&
    typeof firstName === "string" && firstName.length > 0 &&
    typeof lastName === "string" && lastName.length > 0
  );
};

const getServiceClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown;

  if (!isValidRegisterPayload(body)) {
    return NextResponse.json(
      { error: "All fields are required. Password must be at least 6 characters." },
      { status: 400 }
    );
  }

  const supabase = getServiceClient();

  // Step 1 — check if profile already exists (real duplicate)
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", body.email)
    .maybeSingle();

  if (existingProfile) {
    return NextResponse.json(
      { error: "An account with this email already exists. Please sign in." },
      { status: 409 }
    );
  }

  // Step 2 — find and delete any orphaned auth user with this email
  const { data: userList } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const orphaned = userList?.users?.find(
    (u) => u.email?.toLowerCase() === body.email.toLowerCase()
  );

  if (orphaned) {
    const { error: deleteError } = await supabase.auth.admin.deleteUser(orphaned.id);
    if (deleteError) {
      console.error("Could not delete orphaned user:", deleteError);
      return NextResponse.json(
        { error: "Failed to clean up previous registration. Please contact support." },
        { status: 500 }
      );
    }
  }

  // Step 3 — create fresh auth user
  const { data, error: createError } = await supabase.auth.admin.createUser({
    email: body.email,
    password: body.password,
    email_confirm: true,
  });

  if (createError || !data.user) {
    console.error("Auth create error:", createError);
    return NextResponse.json(
      { error: createError?.message ?? "Failed to create account." },
      { status: 400 }
    );
  }

  // Step 4 — insert profile
  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    email: body.email,
    full_name: `${body.firstName} ${body.lastName}`,
    role: "user",
  });

  if (profileError) {
    // Rollback auth user if profile insert fails
    await supabase.auth.admin.deleteUser(data.user.id);
    console.error("Profile insert error:", profileError);
    return NextResponse.json(
      { error: "Failed to create profile. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}