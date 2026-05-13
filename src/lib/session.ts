import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "SHIPPER" | "CARRIER" | "ADMIN";
};

export type SessionData = {
  user?: SessionUser;
};

const password =
  process.env.SESSION_SECRET ?? "dev-only-insecure-secret-please-change-this-value-now-xx";

if (password.length < 32) {
  throw new Error("SESSION_SECRET must be at least 32 characters");
}

export const sessionOptions: SessionOptions = {
  password,
  cookieName: "fathership_session",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  },
};

export async function getSession() {
  return getIronSession<SessionData>(cookies(), sessionOptions);
}

export async function currentUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session.user ?? null;
}
