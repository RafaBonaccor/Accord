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
    title: "Bracelets",
    description: "Browse Accordi Jewelry bracelets with luminous details, gift-ready styles and everyday elegance.",
    locale: "en",
    currentPage: page,
    basePath: "/en/bracelets",
    alternateBasePath: "/bracciali",
  });
}

export default async function BraceletsPage({ searchParams }: Props) {
  const page = parsePageParam((await searchParams).page);
  const products = productsByCategory(await getProducts(), "Bracelets");
  const pagination = paginateItems(products, page);
  if (page > pagination.totalPages) {
    notFound();
  }
  const copy = categoryPageCopy.en.bracelets;

  return (
    <CatalogPage
      {...copy}
      primaryHref="/en#shop"
      secondaryHref="/en"
      products={pagination.items}
      locale="en"
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      pageHref={(nextPage) => pagePath("/en/bracelets", nextPage)}
    />
  );
}
