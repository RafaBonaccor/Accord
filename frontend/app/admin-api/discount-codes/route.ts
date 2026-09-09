import { ensureAdminSession, proxyAdminRequest } from "../../../lib/admin-api-server";

export async function GET(request: Request): Promise<Response> {
  const unauthorized = await ensureAdminSession(request);
  if (unauthorized) {
    return unauthorized;
  }

  return proxyAdminRequest("/discount-codes", {
    method: "GET",
  });
}

export async function POST(request: Request): Promise<Response> {
  const unauthorized = await ensureAdminSession(request);
  if (unauthorized) {
    return unauthorized;
  }

  return proxyAdminRequest("/discount-codes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: await request.text(),
  });
}
