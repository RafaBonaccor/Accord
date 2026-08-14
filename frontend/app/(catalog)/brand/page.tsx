import type { Metadata } from "next";

import { CatalogPage } from "../../../components/catalog-page";
import { getProducts } from "../../../lib/api";
import { featuredProducts } from "../../../lib/catalog";
import { brandPageCopy } from "../../../lib/page-data";

export const metadata: Metadata = {
  title: "Brand Accordi Jewelry",
  description: "Scopri il mondo Accordi Jewelry tra stile, luce e dettagli pensati per il quotidiano e il regalo.",
  alternates: {
    canonical: "/brand",
    languages: {
      it: "/brand",
      en: "/en/brand",
    },
  },
};

export default async function BrandPage() {
  const products = featuredProducts(await getProducts());
  const copy = brandPageCopy.it;

  return (
    <CatalogPage
      {...copy}
      primaryHref="/collezione"
      secondaryHref="/"
      products={products}
      locale="it"
    />
  );
}
