import { ensureAdminSession, proxyAdminRequest } from "../../../../lib/admin-api-server";

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
