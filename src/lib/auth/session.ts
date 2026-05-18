import { cache } from "react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import {
  AUTH_COOKIE_NAME,
  getBearerTokenFromAuthorizationHeader,
  verifyAuthToken,
} from "@/lib/auth/token";
import { getProfileByUserId } from "@/lib/profiles";
import type { CurrentUser } from "@/types/auth";

const buildCurrentUser = async (token: string | null | undefined) => {
  const payload = verifyAuthToken(token);

  if (!payload) {
    return null;
  }

  let profile = null;
  try {
    profile = await getProfileByUserId(payload.sub);
  } catch (error) {
    console.error("Failed to resolve current user profile", error);
    return null;
  }

  if (!profile) {
    return null;
  }

  return {
    email: profile.email,
    fullName: profile.full_name,
    id: profile.id,
    role: profile.role,
  } satisfies CurrentUser;
};

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();

  return buildCurrentUser(cookieStore.get(AUTH_COOKIE_NAME)?.value);
});

export const getCurrentUserFromRequest = async (request: NextRequest) => {
  const bearerToken = getBearerTokenFromAuthorizationHeader(
    request.headers.get("authorization"),
  );
  const cookieToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  return buildCurrentUser(bearerToken ?? cookieToken);
};

export const requireCurrentUser = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
};

export const requireAdminUser = async () => {
  const user = await requireCurrentUser();

  if (user.role !== "admin") {
    redirect("/unauthorized");
  }

  return user;
};
