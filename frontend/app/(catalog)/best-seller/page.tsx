import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { CatalogPage } from "../../../components/catalog-page";
import { getProducts } from "../../../lib/api";
import { featuredProducts } from "../../../lib/catalog";
import { buildCatalogMetadata, pagePath, paginateItems, parsePageParam } from "../../../lib/pagination";
import { bestSellerPageCopy } from "../../../lib/page-data";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const page = parsePageParam((await searchParams).page);
  return buildCatalogMetadata({
    title: "Best Seller Gioielli",
    description: "Scopri i best seller Accordi Jewelry, i pezzi piu amati da regalare, abbinare e indossare ogni giorno.",
    locale: "it",
    currentPage: page,
    basePath: "/best-seller",
    alternateBasePath: "/en/best-sellers",
  });
}

export default async function BestSellerPage({ searchParams }: Props) {
  const page = parsePageParam((await searchParams).page);
  const products = featuredProducts(await getProducts());
  const pagination = paginateItems(products, page);
  if (page > pagination.totalPages) {
    notFound();
  }
  const copy = bestSellerPageCopy.it;

  return (
    <CatalogPage
      {...copy}
      primaryHref="/#shop"
      secondaryHref="/collezione"
      products={pagination.items}
      locale="it"
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      pageHref={(nextPage) => pagePath("/best-seller", nextPage)}
    />
  );
}
