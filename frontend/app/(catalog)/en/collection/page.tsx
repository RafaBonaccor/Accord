import type { Metadata } from "next";

import { CatalogPage } from "../../../../components/catalog-page";
import { getProducts } from "../../../../lib/api";
import { featuredProducts } from "../../../../lib/catalog";
import { collectionPageCopy } from "../../../../lib/page-data";

export const metadata: Metadata = {
  title: "Jewelry Collection",
  description: "Discover the Accordi Jewelry collection through signature pieces, luminous details and contemporary style.",
  alternates: {
    canonical: "/en/collection",
    languages: {
      en: "/en/collection",
      it: "/collezione",
    },
  },
};

export default async function CollectionPage() {
  const products = featuredProducts(await getProducts());
  const copy = collectionPageCopy.en;

  return (
    <CatalogPage
      {...copy}
      primaryHref="/en#shop"
      secondaryHref="/en/brand"
      products={products}
      locale="en"
    />
  );
}
