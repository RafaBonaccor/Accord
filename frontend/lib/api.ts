import { Product } from "./types";

const SERVER_API_URL = process.env.API_URL_SERVER ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const BROWSER_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${SERVER_API_URL}/api/products`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load products");
  }
  const data = (await response.json()) as { items: Product[] };
  return data.items;
}

export async function createCheckout(
  items: Array<{ product_id: number; quantity: number }>,
  email?: string,
): Promise<string> {
  const response = await fetch(`${BROWSER_API_URL}/api/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items, email }),
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
