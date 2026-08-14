import { CartItem, Product } from "./types";

export const CART_STORAGE_KEY = "accordi-cart";
export const CART_UPDATED_EVENT = "accordi-cart-updated";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const saved = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved) as CartItem[];
  } catch {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
}

function dispatchCartUpdated(items: CartItem[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: items }));
}

function sanitizeCart(items: CartItem[]): CartItem[] {
  return items.filter((item) => item.quantity > 0);
}

export function writeCart(items: CartItem[]): void {
  if (typeof window === "undefined") {
    return;
  }

  const next = sanitizeCart(items);
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
  dispatchCartUpdated(next);
}

export function getCartQuantity(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price_cents * item.quantity, 0);
}

export function updateProductQuantity(productId: number, quantity: number): CartItem[] {
  const current = readCart();
  const next = sanitizeCart(
    current.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
  );

  writeCart(next);
  return next;
}

export function removeProductFromCart(productId: number): CartItem[] {
  const current = readCart();
  const next = current.filter((item) => item.product.id !== productId);
  writeCart(next);
  return next;
}

export function clearCart(): void {
  writeCart([]);
}

export function subscribeCart(listener: (items: CartItem[]) => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === CART_STORAGE_KEY) {
      listener(readCart());
    }
  };

  const handleCustomEvent = (event: Event) => {
    const cartEvent = event as CustomEvent<CartItem[]>;
    listener(cartEvent.detail ?? readCart());
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CART_UPDATED_EVENT, handleCustomEvent);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CART_UPDATED_EVENT, handleCustomEvent);
  };
}

export function addProductToCart(product: Product, quantity = 1): CartItem[] {
  const current = readCart();
  const existing = current.find((item) => item.product.id === product.id);

  const next = existing
    ? current.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      )
    : [...current, { product, quantity }];

  writeCart(next);
  return next;
}
