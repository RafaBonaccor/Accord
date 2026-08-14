import { Collection, CollectionInput, Product, ProductInput } from "./types";

const SERVER_API_URL =
  process.env.BACKEND_URL ??
  process.env.API_URL_SERVER ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3000/api";
const BROWSER_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "/api";

export class ApiRequestError extends Error {
  status: number;
  detail?: string;

  constructor(message: string, status: number, detail?: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.detail = detail;
  }
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${SERVER_API_URL}/api/products`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load products");
  }
  const data = (await response.json()) as { items: Product[] };
  return data.items;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const response = await fetch(`${SERVER_API_URL}/api/products/slug/${slug}`, { cache: "no-store" });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error("Unable to load product");
  }
  return (await response.json()) as Product;
}

async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/admin-api${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown network error";
    throw new ApiRequestError("Unable to reach admin service", 0, detail);
  }

  if (!response.ok) {
    let message = "Admin request failed";
    let detail: string | undefined;
    try {
      const data = (await response.json()) as { detail?: string };
      if (data.detail) {
        detail = data.detail;
        message = data.detail;
      }
    } catch {}
    throw new ApiRequestError(message, response.status, detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getAdminProducts(): Promise<Product[]> {
  const data = await adminRequest<{ items: Product[] }>("/products", {
    method: "GET",
  });
  return data.items;
}

export async function createAdminProduct(payload: ProductInput): Promise<Product> {
  return adminRequest<Product>("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminProduct(
  productId: number,
  payload: Partial<ProductInput>,
): Promise<Product> {
  return adminRequest<Product>(`/products/${productId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminProduct(productId: number): Promise<void> {
  await adminRequest<void>(`/products/${productId}`, {
    method: "DELETE",
  });
}

export async function importAdminProducts(
  items: ProductInput[],
): Promise<{ imported_count: number; items: Product[] }> {
  return adminRequest<{ imported_count: number; items: Product[] }>("/products/import-json", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}

export async function getAdminCollections(): Promise<Collection[]> {
  const data = await adminRequest<{ items: Collection[] }>("/collections", {
    method: "GET",
  });
  return data.items;
}

export async function createAdminCollection(payload: CollectionInput): Promise<Collection> {
  return adminRequest<Collection>("/collections", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminCollection(
  collectionId: number,
  payload: Partial<CollectionInput>,
): Promise<Collection> {
  return adminRequest<Collection>(`/collections/${collectionId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminCollection(collectionId: number): Promise<void> {
  await adminRequest<void>(`/collections/${collectionId}`, {
    method: "DELETE",
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
