import type { Metadata } from "next";

import { CatalogPage } from "../../../components/catalog-page";
import { getProducts } from "../../../lib/api";
import { featuredProducts } from "../../../lib/catalog";
import { giftGuidePageCopy } from "../../../lib/page-data";

export const metadata: Metadata = {
  title: "Gift Guide Gioielli",
  description: "Gift guide Accordi Jewelry con idee regalo selezionate per occasioni speciali e pensieri da ricordare.",
  alternates: {
    canonical: "/gift-guide",
    languages: {
      it: "/gift-guide",
      en: "/en/gift-guide",
    },
  },
};

export default async function GiftGuidePage() {
  const products = featuredProducts(await getProducts());
  const copy = giftGuidePageCopy.it;

  return <CatalogPage {...copy} primaryHref="/#shop" secondaryHref="/" products={products} locale="it" />;
}
