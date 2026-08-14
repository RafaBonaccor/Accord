import type { Metadata } from "next";

import { CatalogPage } from "../../../../components/catalog-page";
import { getProducts } from "../../../../lib/api";
import { featuredProducts } from "../../../../lib/catalog";
import { storeLocatorPageCopy } from "../../../../lib/page-data";

export const metadata: Metadata = {
  title: "Store Locator",
  description: "Discover the Accordi world through places, moods and references with a refined contemporary feel.",
  alternates: {
    canonical: "/en/store-locator",
    languages: {
      en: "/en/store-locator",
      it: "/store-locator",
    },
  },
};

export default async function EnStoreLocatorPage() {
  const products = featuredProducts(await getProducts());
  const copy = storeLocatorPageCopy.en;

  return <CatalogPage {...copy} primaryHref="/en/brand" secondaryHref="/en" products={products} locale="en" />;
}
