import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ProductDetailPage } from "../../../../components/product-detail-page";
import { getProductBySlug, getProducts } from "../../../../lib/api";
import {
  productMetadata,
  productStructuredData,
  relatedProductsFor,
} from "../../../../lib/product-page";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return {
      title: "Prodotto non trovato",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
  return productMetadata("it", product);
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const products = await getProducts();
  const relatedProducts = relatedProductsFor(product, products);
  const structuredData = productStructuredData("it", product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.product) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumbs) }}
      />
      <ProductDetailPage locale="it" product={product} relatedProducts={relatedProducts} />
    </>
  );
}
