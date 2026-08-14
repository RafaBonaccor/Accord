import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { CatalogPage } from "../../../components/catalog-page";
import { getProducts } from "../../../lib/api";
import { productsByCategory } from "../../../lib/catalog";
import { buildCatalogMetadata, pagePath, paginateItems, parsePageParam } from "../../../lib/pagination";
import { categoryPageCopy } from "../../../lib/page-data";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const page = parsePageParam((await searchParams).page);
  return buildCatalogMetadata({
    title: "Collane Donna",
    description: "Scopri le collane Accordi Jewelry tra layering delicato, dettagli luminosi e idee regalo contemporanee.",
    locale: "it",
    currentPage: page,
    basePath: "/collane",
    alternateBasePath: "/en/necklaces",
  });
}

export default async function CollanePage({ searchParams }: Props) {
  const page = parsePageParam((await searchParams).page);
  const products = productsByCategory(await getProducts(), "Necklaces");
  const pagination = paginateItems(products, page);
  if (page > pagination.totalPages) {
    notFound();
  }
  const copy = categoryPageCopy.it.necklaces;

  return (
    <CatalogPage
      {...copy}
      primaryHref="/#shop"
      secondaryHref="/"
      products={pagination.items}
      locale="it"
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      pageHref={(nextPage) => pagePath("/collane", nextPage)}
    />
  );
}
