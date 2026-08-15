import { ensureAdminSession, proxyAdminRequest } from "../../../../lib/admin-api-server";
import { parseProductMultipartForm } from "../../../../lib/admin-product-payload";

type Params = {
  params: {
    productId: string;
  };
};

export async function PATCH(request: Request, { params }: Params): Promise<Response> {
  const unauthorized = await ensureAdminSession();
  if (unauthorized) {
    return unauthorized;
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    try {
      const formData = await request.formData();
      const payload = await parseProductMultipartForm(formData);
      return proxyAdminRequest(`/products/${params.productId}`, {
        method: "PATCH",
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

  return proxyAdminRequest(`/products/${params.productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: await request.text(),
  });
}

export async function DELETE(_request: Request, { params }: Params): Promise<Response> {
  const unauthorized = await ensureAdminSession();
  if (unauthorized) {
    return unauthorized;
  }

  return proxyAdminRequest(`/products/${params.productId}`, {
    method: "DELETE",
  });
}
