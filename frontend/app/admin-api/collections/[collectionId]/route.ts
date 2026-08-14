import { ensureAdminSession, proxyAdminRequest } from "../../../../lib/admin-api-server";

type Params = {
  params: {
    collectionId: string;
  };
};

export async function PATCH(request: Request, { params }: Params): Promise<Response> {
  const unauthorized = await ensureAdminSession();
  if (unauthorized) {
    return unauthorized;
  }

  return proxyAdminRequest(`/collections/${params.collectionId}`, {
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

  return proxyAdminRequest(`/collections/${params.collectionId}`, {
    method: "DELETE",
  });
}
