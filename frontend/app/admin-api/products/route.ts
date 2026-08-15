import { ensureAdminSession, proxyAdminRequest } from "../../../lib/admin-api-server";
import { parseProductMultipartForm } from "../../../lib/admin-product-payload";

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

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    try {
      const formData = await request.formData();
      const payload = await parseProductMultipartForm(formData);
      return proxyAdminRequest("/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Invalid product upload payload";
      return Response.json({ detail }, { status: 422 });
    }
  }

  return proxyAdminRequest("/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: await request.text(),
  });
}
