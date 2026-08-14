import type { Metadata } from "next";

import { CatalogPage } from "../../../components/catalog-page";
import { getProducts } from "../../../lib/api";
import { latestProducts } from "../../../lib/catalog";
import { journalPageCopy } from "../../../lib/page-data";

export const metadata: Metadata = {
  title: "Journal Gioielli",
  description: "Journal Accordi Jewelry con novita, ispirazioni e storie di collezione dal gusto contemporaneo.",
  alternates: {
    canonical: "/journal",
    languages: {
      it: "/journal",
      en: "/en/journal",
    },
  },
};

export default async function JournalPage() {
  const products = latestProducts(await getProducts());
  const copy = journalPageCopy.it;

  return <CatalogPage {...copy} primaryHref="/novita" secondaryHref="/brand" products={products} locale="it" />;
}
