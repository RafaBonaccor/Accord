import { ensureAdminSession, proxyAdminRequest } from "../../../lib/admin-api-server";

export async function GET(): Promise<Response> {
  const unauthorized = await ensureAdminSession();
  if (unauthorized) {
    return unauthorized;
  }

  return proxyAdminRequest("/products", {
    method: "GET",
  });
}

export async function POST(request: Request): Promise<Response> {
  const unauthorized = await ensureAdminSession();
  if (unauthorized) {
    return unauthorized;
  }

  return proxyAdminRequest("/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: await request.text(),
  });
}
