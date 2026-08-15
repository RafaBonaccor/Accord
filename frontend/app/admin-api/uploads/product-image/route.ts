import { ensureAdminSession } from "../../../../../lib/admin-api-server";
import { uploadProductImage } from "../../../../../lib/supabase-storage";

export async function POST(request: Request): Promise<Response> {
  const unauthorized = await ensureAdminSession();
  if (unauthorized) {
    return unauthorized;
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ detail: "Invalid upload form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ detail: "Missing image file" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return Response.json({ detail: "Only image uploads are supported" }, { status: 422 });
  }

  try {
    const uploaded = await uploadProductImage(file);
    return Response.json({ image_url: uploaded.imageUrl, path: uploaded.path }, { status: 201 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unable to upload image";
    return Response.json({ detail }, { status: 503 });
  }
}
