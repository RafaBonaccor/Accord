import type { Metadata } from "next";

import { CatalogPage } from "../../../../components/catalog-page";
import { getProducts } from "../../../../lib/api";
import { featuredProducts } from "../../../../lib/catalog";
import { brandPageCopy } from "../../../../lib/page-data";

export const metadata: Metadata = {
  title: "Accordi Jewelry Brand",
  description: "Discover the Accordi Jewelry world through style, light and pieces made for everyday elegance.",
  alternates: {
    canonical: "/en/brand",
    languages: {
      en: "/en/brand",
      it: "/brand",
    },
  },
};

export default async function EnBrandPage() {
  const products = featuredProducts(await getProducts());
  const copy = brandPageCopy.en;

  return (
    <CatalogPage
      {...copy}
      primaryHref="/en/collection"
      secondaryHref="/en"
      products={products}
      locale="en"
    />
  );
}
