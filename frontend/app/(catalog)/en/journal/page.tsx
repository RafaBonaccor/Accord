import type { Metadata } from "next";

import { CatalogPage } from "../../../../components/catalog-page";
import { getProducts } from "../../../../lib/api";
import { latestProducts } from "../../../../lib/catalog";
import { journalPageCopy } from "../../../../lib/page-data";

export const metadata: Metadata = {
  title: "Journal",
  description: "Explore the Accordi Jewelry journal with newness, inspiration and collection stories.",
  alternates: {
    canonical: "/en/journal",
    languages: {
      en: "/en/journal",
      it: "/journal",
    },
  },
};

export default async function EnJournalPage() {
  const products = latestProducts(await getProducts());
  const copy = journalPageCopy.en;

  return <CatalogPage {...copy} primaryHref="/en/new-arrivals" secondaryHref="/en/brand" products={products} locale="en" />;
}
