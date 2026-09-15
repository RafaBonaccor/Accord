import "server-only";

import type { ProductInput } from "./types";
import { uploadProductImage } from "./supabase-storage";


function parseRequiredString(formData: FormData, field: keyof ProductInput | "name" | "slug" | "description" | "image_url" | "category" | "material"): string {
  return String(formData.get(field) ?? "").trim();
}

function parseInteger(formData: FormData, field: "price_cents"): number {
  const value = String(formData.get(field) ?? "").trim();
  return Number(value);
}

function parseNullableInteger(formData: FormData, field: "collection_id"): number | null {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) {
    return null;
  }
  return Number(value);
}

function parseBoolean(formData: FormData, field: "featured"): boolean {
  const value = String(formData.get(field) ?? "").trim().toLowerCase();
  return value === "true" || value === "1" || value === "on";
}

function parseBooleanDefault(formData: FormData, field: "in_stock", defaultValue: boolean): boolean {
  if (!formData.has(field)) {
    return defaultValue;
  }
  const value = String(formData.get(field) ?? "").trim().toLowerCase();
  return value === "true" || value === "1" || value === "on";
}

export async function parseProductMultipartForm(formData: FormData): Promise<ProductInput> {
  const file = formData.get("file");
  const galleryFiles = formData.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
  let imageUrl = parseRequiredString(formData, "image_url");
  const imageUrls: string[] = [];

  if (file instanceof File && file.size > 0) {
    const uploaded = await uploadProductImage(file);
    imageUrl = uploaded.imageUrl;
    imageUrls.push(uploaded.imageUrl);
  }

  for (const galleryFile of galleryFiles.slice(0, 12)) {
    const uploaded = await uploadProductImage(galleryFile);
    imageUrls.push(uploaded.imageUrl);
  }

  if (!imageUrl && imageUrls.length) {
    imageUrl = imageUrls[0];
  }

  return {
    name: parseRequiredString(formData, "name"),
    slug: parseRequiredString(formData, "slug"),
    description: parseRequiredString(formData, "description"),
    price_cents: parseInteger(formData, "price_cents"),
    image_url: imageUrl,
    category: parseRequiredString(formData, "category"),
    material: parseRequiredString(formData, "material"),
    collection_id: parseNullableInteger(formData, "collection_id"),
    featured: parseBoolean(formData, "featured"),
    in_stock: parseBooleanDefault(formData, "in_stock", true),
    stock_quantity: Number(formData.get("stock_quantity") ?? "1"),
    image_urls: imageUrls,
  };
}
