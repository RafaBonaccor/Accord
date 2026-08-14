import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { CatalogPage } from "../../../../components/catalog-page";
import { getProducts } from "../../../../lib/api";
import { productsByCategory } from "../../../../lib/catalog";
import { buildCatalogMetadata, pagePath, paginateItems, parsePageParam } from "../../../../lib/pagination";
import { categoryPageCopy } from "../../../../lib/page-data";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const page = parsePageParam((await searchParams).page);
  return buildCatalogMetadata({
    title: "Earrings",
    description: "Explore Accordi Jewelry earrings with luminous details and easy everyday styling.",
    locale: "en",
    currentPage: page,
    basePath: "/en/earrings",
    alternateBasePath: "/orecchini",
  });
}

export default async function EarringsPage({ searchParams }: Props) {
  const page = parsePageParam((await searchParams).page);
  const products = productsByCategory(await getProducts(), "Earrings");
  const pagination = paginateItems(products, page);
  if (page > pagination.totalPages) {
    notFound();
  }
  const copy = categoryPageCopy.en.earrings;

  return (
    <CatalogPage
      {...copy}
      primaryHref="/en#shop"
      secondaryHref="/en"
      products={pagination.items}
      locale="en"
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      pageHref={(nextPage) => pagePath("/en/earrings", nextPage)}
    />
  );
}
