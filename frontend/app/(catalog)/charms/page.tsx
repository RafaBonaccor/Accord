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
    title: "Charms Gioielli",
    description: "Scopri i charms Accordi Jewelry da collezionare, abbinare e regalare con naturalezza.",
    locale: "it",
    currentPage: page,
    basePath: "/charms",
    alternateBasePath: "/en/charms",
  });
}

export default async function CharmsPage({ searchParams }: Props) {
  const page = parsePageParam((await searchParams).page);
  const products = productsByCategory(await getProducts(), "Charms");
  const pagination = paginateItems(products, page);
  if (page > pagination.totalPages) {
    notFound();
  }
  const copy = categoryPageCopy.it.charms;

  return (
    <CatalogPage
      {...copy}
      primaryHref="/#shop"
      secondaryHref="/"
      products={pagination.items}
      locale="it"
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      pageHref={(nextPage) => pagePath("/charms", nextPage)}
    />
  );
}
