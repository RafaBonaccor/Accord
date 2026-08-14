import type { Metadata } from "next";

import { CatalogPage } from "../../../components/catalog-page";
import { getProducts } from "../../../lib/api";
import { featuredProducts } from "../../../lib/catalog";
import { collectionPageCopy } from "../../../lib/page-data";

export const metadata: Metadata = {
  title: "Collezione Gioielli",
  description: "Scopri la collezione Accordi Jewelry tra pezzi iconici, dettagli luminosi e stile contemporaneo.",
  alternates: {
    canonical: "/collezione",
    languages: {
      it: "/collezione",
      en: "/en/collection",
    },
  },
};

export default async function CollezionePage() {
  const products = featuredProducts(await getProducts());
  const copy = collectionPageCopy.it;

  return (
    <CatalogPage
      {...copy}
      primaryHref="/#shop"
      secondaryHref="/brand"
      products={products}
      locale="it"
    />
  );
}
