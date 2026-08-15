import "server-only";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

function supabaseUrl(): string {
  return requireEnv("SUPABASE_URL").replace(/\/$/, "");
}

function supabaseServiceRoleKey(): string {
  return requireEnv("SUPABASE_SERVICE_ROLE_KEY");
}

function storageBucket(): string {
  return process.env.SUPABASE_STORAGE_BUCKET ?? "products";
}

function slugifyFilename(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function buildStoragePath(filename: string): string {
  const parts = filename.split(".");
  const extension = parts.length > 1 ? parts.pop() ?? "jpg" : "jpg";
  const baseName = slugifyFilename(parts.join(".")) || "product-image";
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `admin/${baseName}-${stamp}.${extension.toLowerCase()}`;
}

export async function uploadProductImage(file: File): Promise<{ imageUrl: string; path: string }> {
  const filePath = buildStoragePath(file.name);
  const url = `${supabaseUrl()}/storage/v1/object/${storageBucket()}/${filePath}`;
  const body = Buffer.from(await file.arrayBuffer());

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${supabaseServiceRoleKey()}`,
      apikey: supabaseServiceRoleKey(),
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true",
    },
    body,
  });

  if (!response.ok) {
    let detail = "Supabase Storage upload failed";
    try {
      const data = (await response.json()) as { error?: string; message?: string };
      detail = data.message ?? data.error ?? detail;
    } catch {}
    throw new Error(detail);
  }

  const imageUrl = `${supabaseUrl()}/storage/v1/object/public/${storageBucket()}/${filePath}`;
  return { imageUrl, path: filePath };
}
