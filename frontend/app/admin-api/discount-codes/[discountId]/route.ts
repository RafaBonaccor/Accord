import { ensureAdminSession, proxyAdminRequest } from "../../../../lib/admin-api-server";

type Params = {
  params: {
    discountId: string;
  };
};

export async function PATCH(request: Request, { params }: Params): Promise<Response> {
  const unauthorized = await ensureAdminSession(request);
  if (unauthorized) {
    return unauthorized;
  }

  return proxyAdminRequest(`/discount-codes/${params.discountId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: await request.text(),
  });
}

export async function DELETE(request: Request, { params }: Params): Promise<Response> {
  const unauthorized = await ensureAdminSession(request);
  if (unauthorized) {
    return unauthorized;
  }

  return proxyAdminRequest(`/discount-codes/${params.discountId}`, {
    method: "DELETE",
  });
}
