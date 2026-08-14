import { Locale } from "./i18n";
import { routeFor, type NavKey } from "./routes";
import { Product } from "./types";

const categoryMap: Record<string, NavKey> = {
  bracelets: "bracelets",
  rings: "rings",
  charms: "charms",
  earrings: "earrings",
  necklaces: "necklaces",
};

const localizedCategoryLabels: Record<Locale, Record<NavKey, string>> = {
  it: {
    new: "Novita",
    charms: "Charms",
    bracelets: "Bracciali",
    rings: "Anelli",
    earrings: "Orecchini",
    necklaces: "Collane",
    bestsellers: "Best seller",
    giftguide: "Gift guide",
    stores: "Store locator",
    journal: "Journal",
    collection: "Collezione",
    privacy: "Privacy",
    brand: "Brand",
    cart: "Shopping bag",
  },
  en: {
    new: "New arrivals",
    charms: "Charms",
    bracelets: "Bracelets",
    rings: "Rings",
    earrings: "Earrings",
    necklaces: "Necklaces",
    bestsellers: "Best sellers",
    giftguide: "Gift guide",
    stores: "Store locator",
    journal: "Journal",
    collection: "Collection",
    privacy: "Privacy",
    brand: "Brand",
    cart: "Shopping bag",
  },
};

export function productPath(locale: Locale, slug: string): string {
  return locale === "en" ? `/en/products/${slug}` : `/products/${slug}`;
}

export function categoryKeyFromProduct(product: Product): NavKey | null {
  return categoryMap[product.category.toLowerCase()] ?? null;
}

export function categoryPathForProduct(locale: Locale, product: Product): string | null {
  const key = categoryKeyFromProduct(product);
  return key ? routeFor(locale, key) : null;
}

export function categoryLabelForProduct(locale: Locale, product: Product): string {
  const key = categoryKeyFromProduct(product);
  return key ? localizedCategoryLabels[locale][key] : product.category;
}
