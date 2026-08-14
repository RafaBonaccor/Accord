import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { CatalogPage } from "../../../../components/catalog-page";
import { getProducts } from "../../../../lib/api";
import { featuredProducts } from "../../../../lib/catalog";
import { buildCatalogMetadata, pagePath, paginateItems, parsePageParam } from "../../../../lib/pagination";
import { bestSellerPageCopy } from "../../../../lib/page-data";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const page = parsePageParam((await searchParams).page);
  return buildCatalogMetadata({
    title: "Best Sellers",
    description: "Discover Accordi Jewelry best sellers, the most loved pieces to gift, layer and wear every day.",
    locale: "en",
    currentPage: page,
    basePath: "/en/best-sellers",
    alternateBasePath: "/best-seller",
  });
}

export default async function EnBestSellersPage({ searchParams }: Props) {
  const page = parsePageParam((await searchParams).page);
  const products = featuredProducts(await getProducts());
  const pagination = paginateItems(products, page);
  if (page > pagination.totalPages) {
    notFound();
  }
  const copy = bestSellerPageCopy.en;

  return (
    <CatalogPage
      {...copy}
      primaryHref="/en#shop"
      secondaryHref="/en/collection"
      products={pagination.items}
      locale="en"
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      pageHref={(nextPage) => pagePath("/en/best-sellers", nextPage)}
    />
  );
}
