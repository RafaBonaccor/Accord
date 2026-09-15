import { ensureAdminSession, proxyAdminRequest } from "../../../lib/admin-api-server";

export async function GET(request: Request): Promise<Response> {
  const unauthorized = await ensureAdminSession(request);
  if (unauthorized) {
    return unauthorized;
  }

  return proxyAdminRequest("/stock-notifications", {
    method: "GET",
  });
}
