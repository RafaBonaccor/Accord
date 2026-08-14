import { Locale } from "./i18n";

export type NavKey =
  | "new"
  | "charms"
  | "bracelets"
  | "rings"
  | "earrings"
  | "necklaces"
  | "bestsellers"
  | "giftguide"
  | "stores"
  | "journal"
  | "collection"
  | "privacy"
  | "brand"
  | "cart";

const localeRoutes: Record<Locale, Record<NavKey, string>> = {
  it: {
    new: "/novita",
    charms: "/charms",
    bracelets: "/bracciali",
    rings: "/anelli",
    earrings: "/orecchini",
    necklaces: "/collane",
    bestsellers: "/best-seller",
    giftguide: "/gift-guide",
    stores: "/store-locator",
    journal: "/journal",
    collection: "/collezione",
    privacy: "/privacy",
    brand: "/brand",
    cart: "/cart",
  },
  en: {
    new: "/en/new-arrivals",
    charms: "/en/charms",
    bracelets: "/en/bracelets",
    rings: "/en/rings",
    earrings: "/en/earrings",
    necklaces: "/en/necklaces",
    bestsellers: "/en/best-sellers",
    giftguide: "/en/gift-guide",
    stores: "/en/store-locator",
    journal: "/en/journal",
    collection: "/en/collection",
    privacy: "/en/privacy",
    brand: "/en/brand",
    cart: "/en/cart",
  },
};

export function routeFor(locale: Locale, key: NavKey): string {
  return localeRoutes[locale][key];
}
