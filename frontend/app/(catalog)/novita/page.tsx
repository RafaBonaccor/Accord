import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { CatalogPage } from "../../../components/catalog-page";
import { getProducts } from "../../../lib/api";
import { latestProducts } from "../../../lib/catalog";
import { buildCatalogMetadata, pagePath, paginateItems, parsePageParam } from "../../../lib/pagination";
import { arrivalsPageCopy } from "../../../lib/page-data";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const page = parsePageParam((await searchParams).page);
  return buildCatalogMetadata({
    title: "Novita Gioielli",
    description: "Scopri gli ultimi arrivi Accordi Jewelry tra novita luminose, idee regalo e pezzi da indossare subito.",
    locale: "it",
    currentPage: page,
    basePath: "/novita",
    alternateBasePath: "/en/new-arrivals",
  });
}

export default async function NovitaPage({ searchParams }: Props) {
  const page = parsePageParam((await searchParams).page);
  const products = latestProducts(await getProducts());
  const pagination = paginateItems(products, page);
  if (page > pagination.totalPages) {
    notFound();
  }
  const copy = arrivalsPageCopy.it;

  return (
    <CatalogPage
      {...copy}
      primaryHref="/#shop"
      secondaryHref="/collezione"
      products={pagination.items}
      locale="it"
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      pageHref={(nextPage) => pagePath("/novita", nextPage)}
    />
  );
}
