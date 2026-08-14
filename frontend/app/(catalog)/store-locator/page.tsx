import type { Metadata } from "next";

import { CatalogPage } from "../../../components/catalog-page";
import { getProducts } from "../../../lib/api";
import { featuredProducts } from "../../../lib/catalog";
import { storeLocatorPageCopy } from "../../../lib/page-data";

export const metadata: Metadata = {
  title: "Store Locator",
  description: "Scopri il mondo Accordi attraverso luoghi, atmosfere e riferimenti dal gusto contemporaneo.",
  alternates: {
    canonical: "/store-locator",
    languages: {
      it: "/store-locator",
      en: "/en/store-locator",
    },
  },
};

export default async function StoreLocatorPage() {
  const products = featuredProducts(await getProducts());
  const copy = storeLocatorPageCopy.it;

  return <CatalogPage {...copy} primaryHref="/brand" secondaryHref="/" products={products} locale="it" />;
}
