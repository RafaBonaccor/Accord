import { Product, ProductInput } from "./types";

const SERVER_API_URL =
  process.env.BACKEND_URL ??
  process.env.API_URL_SERVER ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3000/api";
const BROWSER_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "/api";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${SERVER_API_URL}/products`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load products");
  }
  const data = (await response.json()) as { items: Product[] };
  return data.items;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const response = await fetch(`${SERVER_API_URL}/products/slug/${slug}`, { cache: "no-store" });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error("Unable to load product");
  }
  return (await response.json()) as Product;
}

async function adminRequest<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BROWSER_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = "Admin request failed";
    try {
      const data = (await response.json()) as { detail?: string };
      if (data.detail) {
        message = data.detail;
      }
    } catch {}
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getAdminProducts(token: string): Promise<Product[]> {
  const data = await adminRequest<{ items: Product[] }>("/admin/products", token, {
    method: "GET",
  });
  return data.items;
}

export async function createAdminProduct(token: string, payload: ProductInput): Promise<Product> {
  return adminRequest<Product>("/admin/products", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminProduct(
  token: string,
  productId: number,
  payload: Partial<ProductInput>,
): Promise<Product> {
  return adminRequest<Product>(`/admin/products/${productId}`, token, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminProduct(token: string, productId: number): Promise<void> {
  await adminRequest<void>(`/admin/products/${productId}`, token, {
    method: "DELETE",
  });
}

export async function importAdminProducts(
  token: string,
  items: ProductInput[],
): Promise<{ imported_count: number; items: Product[] }> {
  return adminRequest<{ imported_count: number; items: Product[] }>("/admin/products/import-json", token, {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}

export async function createCheckout(
  items: Array<{ product_id: number; quantity: number }>,
  locale: "it" | "en",
  email?: string,
): Promise<string> {
  const response = await fetch(`${BROWSER_API_URL}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items, email, locale }),
  });

  if (!response.ok) {
    let message = "Unable to create checkout";
    try {
      const data = (await response.json()) as { detail?: string };
      if (data.detail) {
        message = data.detail;
      }
    } catch {}
    throw new Error(message);
  }

  const data = (await response.json()) as { url: string };
  return data.url;
}
