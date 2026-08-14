import "server-only";

import { createHmac, timingSafeEqual } from "crypto";

import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "accordi_admin_session";

const SESSION_TTL_SECONDS = 60 * 60 * 12;

function adminUsername(): string {
  return process.env.ADMIN_USERNAME ?? "admin";
}

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? process.env.ADMIN_API_TOKEN ?? "";
}

function sessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? `${adminUsername()}:${adminPassword()}`;
}

function createSignature(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function createSessionValue(username: string): string {
  const payload = Buffer.from(JSON.stringify({ role: "admin", username }), "utf8").toString("base64url");
  return `${payload}.${createSignature(payload)}`;
}

function readSessionValue(value: string | undefined): { role: string; username: string } | null {
  if (!value) {
    return null;
  }

  const [payload, signature] = value.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expected = createSignature(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      role?: string;
      username?: string;
    };
    if (parsed.role !== "admin" || parsed.username !== adminUsername()) {
      return null;
    }
    return { role: parsed.role, username: parsed.username };
  } catch {
    return null;
  }
}

export function validateAdminCredentials(username: string, password: string): boolean {
  return username === adminUsername() && password === adminPassword();
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return readSessionValue(cookieStore.get(ADMIN_SESSION_COOKIE)?.value) !== null;
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createSessionValue(adminUsername()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
