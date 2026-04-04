import type { UserRole } from "@/types/database";

export type AuthTokenPayload = {
  email: string;
  exp: number;
  iat: number;
  role: UserRole;
  sub: string;
};

export type CurrentUser = {
  email: string;
  fullName: string;
  id: string;
  role: UserRole;
};

export type LoginRequestBody = {
  email: string;
  password: string;
};

export type LoginResponseBody = {
  expiresIn: number;
  token: string;
  user: CurrentUser;
};
