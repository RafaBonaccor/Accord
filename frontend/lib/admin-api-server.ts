import "server-only";

import { isAdminAuthenticated } from "./admin-auth";

const BACKEND_URL =
  process.env.BACKEND_URL ??
  process.env.API_URL_SERVER ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

function adminApiToken(): string {
  return process.env.ADMIN_API_TOKEN ?? "";
}

export async function ensureAdminSession(): Promise<Response | null> {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ detail: "Admin authentication required" }, { status: 401 });
  }

  if (!adminApiToken()) {
    return Response.json({ detail: "Admin API token is not configured" }, { status: 503 });
  }

  return null;
}

export async function proxyAdminRequest(path: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(`${BACKEND_URL}/api/admin${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${adminApiToken()}`,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/json",
    },
  });
}
