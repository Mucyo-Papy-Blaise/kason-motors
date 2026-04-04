import { createHmac, timingSafeEqual } from "node:crypto";

import { getAuthTokenSecret } from "@/lib/env";
import type { AuthTokenPayload } from "@/types/auth";

const JWT_HEADER = {
  alg: "HS256",
  typ: "JWT",
} as const;

export const AUTH_COOKIE_NAME = "km_access_token";
export const AUTH_TOKEN_TTL_SECONDS = 60 * 60 * 24;

const toBase64Url = (value: string) =>
  Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const fromBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);

  return Buffer.from(`${normalized}${padding}`, "base64").toString("utf8");
};

const sign = (value: string) =>
  createHmac("sha256", getAuthTokenSecret())
    .update(value)
    .digest("base64url");

export const createAuthToken = (
  payload: Omit<AuthTokenPayload, "exp" | "iat">,
  issuedAt = Math.floor(Date.now() / 1000),
) => {
  const completePayload: AuthTokenPayload = {
    ...payload,
    exp: issuedAt + AUTH_TOKEN_TTL_SECONDS,
    iat: issuedAt,
  };

  const encodedHeader = toBase64Url(JSON.stringify(JWT_HEADER));
  const encodedPayload = toBase64Url(JSON.stringify(completePayload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const signature = sign(unsignedToken);

  return `${unsignedToken}.${signature}`;
};

export const verifyAuthToken = (token: string | undefined | null) => {
  if (!token) {
    return null;
  }

  const segments = token.split(".");

  if (segments.length !== 3) {
    return null;
  }

  const [encodedHeader, encodedPayload, providedSignature] = segments;
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = sign(unsignedToken);

  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  const header = JSON.parse(fromBase64Url(encodedHeader)) as typeof JWT_HEADER;

  if (header.alg !== JWT_HEADER.alg || header.typ !== JWT_HEADER.typ) {
    return null;
  }

  const payload = JSON.parse(fromBase64Url(encodedPayload)) as AuthTokenPayload;
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp <= now) {
    return null;
  }

  return payload;
};

export const getBearerTokenFromAuthorizationHeader = (
  authorizationHeader: string | null,
) => {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.slice("Bearer ".length).trim() || null;
};
