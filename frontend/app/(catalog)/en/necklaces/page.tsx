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
    title: "Necklaces",
    description: "Discover Accordi Jewelry necklaces for layering, gifting and contemporary everyday looks.",
    locale: "en",
    currentPage: page,
    basePath: "/en/necklaces",
    alternateBasePath: "/collane",
  });
}

export default async function NecklacesPage({ searchParams }: Props) {
  const page = parsePageParam((await searchParams).page);
  const products = productsByCategory(await getProducts(), "Necklaces");
  const pagination = paginateItems(products, page);
  if (page > pagination.totalPages) {
    notFound();
  }
  const copy = categoryPageCopy.en.necklaces;

  return (
    <CatalogPage
      {...copy}
      primaryHref="/en#shop"
      secondaryHref="/en"
      products={pagination.items}
      locale="en"
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      pageHref={(nextPage) => pagePath("/en/necklaces", nextPage)}
    />
  );
}
