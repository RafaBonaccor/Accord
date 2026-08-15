import { ensureAdminSession } from "../../../../lib/admin-api-server";
import { uploadProductImage } from "../../../../lib/supabase-storage";

const ALLOWED_IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".bmp",
  ".tif",
  ".tiff",
  ".svg",
  ".avif",
  ".heic",
  ".heif",
  ".jfif",
]);

function isAcceptedImageFile(file: File): boolean {
  if (file.type.startsWith("image/")) {
    return true;
  }

  const fileName = file.name.toLowerCase();
  for (const extension of ALLOWED_IMAGE_EXTENSIONS) {
    if (fileName.endsWith(extension)) {
      return true;
    }
  }

  return false;
}

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

  if (!isAcceptedImageFile(file)) {
    return Response.json(
      { detail: "Unsupported image format. Use jpg, jpeg, png, webp, gif, bmp, tif, tiff, svg, avif, heic or heif." },
      { status: 422 },
    );
  }

  try {
    const uploaded = await uploadProductImage(file);
    return Response.json({ image_url: uploaded.imageUrl, path: uploaded.path }, { status: 201 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unable to upload image";
    return Response.json({ detail }, { status: 503 });
  }
}
