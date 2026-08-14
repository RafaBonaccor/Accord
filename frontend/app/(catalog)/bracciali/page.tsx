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
    title: "Bracciali Donna",
    description: "Esplora i bracciali Accordi Jewelry tra linee luminose, dettagli da regalare e modelli da indossare ogni giorno.",
    locale: "it",
    currentPage: page,
    basePath: "/bracciali",
    alternateBasePath: "/en/bracelets",
  });
}

export default async function BraccialiPage({ searchParams }: Props) {
  const page = parsePageParam((await searchParams).page);
  const products = productsByCategory(await getProducts(), "Bracelets");
  const pagination = paginateItems(products, page);
  if (page > pagination.totalPages) {
    notFound();
  }
  const copy = categoryPageCopy.it.bracelets;

  return (
    <CatalogPage
      {...copy}
      primaryHref="/#shop"
      secondaryHref="/"
      products={pagination.items}
      locale="it"
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      pageHref={(nextPage) => pagePath("/bracciali", nextPage)}
    />
  );
}
