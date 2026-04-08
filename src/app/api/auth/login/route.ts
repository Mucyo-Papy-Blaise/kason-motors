import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  AUTH_COOKIE_NAME,
  AUTH_TOKEN_TTL_SECONDS,
  createAuthToken,
} from "@/lib/auth/token";
import { getProfileByUserId } from "@/lib/profiles";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import type { LoginRequestBody, LoginResponseBody } from "@/types/auth";

const isValidLoginPayload = (value: unknown): value is LoginRequestBody => {
  if (!value || typeof value !== "object") return false;
  const { email, password } = value as Record<string, unknown>;
  return (
    typeof email === "string" && email.length > 0 &&
    typeof password === "string" && password.length > 0
  );
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown;

  if (!isValidLoginPayload(body)) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password,
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const profile = await getProfileByUserId(data.user.id);

  if (!profile) {
    return NextResponse.json(
      { error: "No profile found for this account." },
      { status: 403 }
    );
  }

  const token = createAuthToken({
    email: profile.email,
    role: profile.role,
    sub: profile.id,
  });

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: AUTH_TOKEN_TTL_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  const responseBody: LoginResponseBody = {
    expiresIn: AUTH_TOKEN_TTL_SECONDS,
    token,
    user: {
      email: profile.email,
      fullName: profile.full_name,
      id: profile.id,
      role: profile.role,
    },
  };

  return NextResponse.json(responseBody);
}