import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { CatalogPage } from "../../../../components/catalog-page";
import { getProducts } from "../../../../lib/api";
import { latestProducts } from "../../../../lib/catalog";
import { buildCatalogMetadata, pagePath, paginateItems, parsePageParam } from "../../../../lib/pagination";
import { arrivalsPageCopy } from "../../../../lib/page-data";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const page = parsePageParam((await searchParams).page);
  return buildCatalogMetadata({
    title: "New Arrivals Jewelry",
    description: "Discover the latest Accordi Jewelry arrivals, selected for gifting, layering and everyday elegance.",
    locale: "en",
    currentPage: page,
    basePath: "/en/new-arrivals",
    alternateBasePath: "/novita",
  });
}

export default async function NewArrivalsPage({ searchParams }: Props) {
  const page = parsePageParam((await searchParams).page);
  const products = latestProducts(await getProducts());
  const pagination = paginateItems(products, page);
  if (page > pagination.totalPages) {
    notFound();
  }
  const copy = arrivalsPageCopy.en;

  return (
    <CatalogPage
      {...copy}
      primaryHref="/en#shop"
      secondaryHref="/en/collection"
      products={pagination.items}
      locale="en"
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      pageHref={(nextPage) => pagePath("/en/new-arrivals", nextPage)}
    />
  );
}
