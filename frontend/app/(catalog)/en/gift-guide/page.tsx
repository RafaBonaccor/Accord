import type { Metadata } from "next";

import { CatalogPage } from "../../../../components/catalog-page";
import { getProducts } from "../../../../lib/api";
import { featuredProducts } from "../../../../lib/catalog";
import { giftGuidePageCopy } from "../../../../lib/page-data";

export const metadata: Metadata = {
  title: "Gift Guide",
  description: "Accordi Jewelry gift guide with selected pieces for special occasions and thoughtful gifting.",
  alternates: {
    canonical: "/en/gift-guide",
    languages: {
      en: "/en/gift-guide",
      it: "/gift-guide",
    },
  },
};

export default async function EnGiftGuidePage() {
  const products = featuredProducts(await getProducts());
  const copy = giftGuidePageCopy.en;

  return <CatalogPage {...copy} primaryHref="/en#shop" secondaryHref="/en" products={products} locale="en" />;
}
