import type { Metadata } from "next";

import { Locale } from "./i18n";
import {
  categoryLabelForProduct,
  categoryPathForProduct,
  productPath,
} from "./product-routes";
import { absoluteUrl } from "./site";
import { Product } from "./types";

export function relatedProductsFor(product: Product, products: Product[]): Product[] {
  return products
    .filter((item) => item.id !== product.id)
    .sort((left, right) => {
      const leftScore = left.category === product.category ? 1 : 0;
      const rightScore = right.category === product.category ? 1 : 0;
      return rightScore - leftScore || Number(right.featured) - Number(left.featured) || right.id - left.id;
    })
    .slice(0, 3);
}

export function productMetadata(locale: Locale, product: Product): Metadata {
  const canonical = productPath(locale, product.slug);
  const title =
    locale === "it"
      ? `${product.name} ${categoryLabelForProduct(locale, product)}`
      : `${product.name} ${categoryLabelForProduct(locale, product)}`;
  const description =
    locale === "it"
      ? `${product.name} in ${product.material.toLowerCase()}, categoria ${categoryLabelForProduct(locale, product).toLowerCase()}. Scopri dettagli prodotto, prezzo e altri gioielli Accordi Jewelry.`
      : `${product.name} in ${product.material.toLowerCase()}, filed under ${categoryLabelForProduct(locale, product).toLowerCase()}. Explore product details, price and related Accordi Jewelry pieces.`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        it: productPath("it", product.slug),
        en: productPath("en", product.slug),
        "x-default": productPath("it", product.slug),
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: absoluteUrl(canonical),
      images: [{ url: product.image_url, alt: product.name }],
      locale: locale === "it" ? "it_IT" : "en_US",
    },
  };
}

export function productStructuredData(locale: Locale, product: Product) {
  const canonical = absoluteUrl(productPath(locale, product.slug));
  const categoryPath = categoryPathForProduct(locale, product);
  const categoryLabel = categoryLabelForProduct(locale, product);

  return {
    product: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: [product.image_url],
      category: categoryLabel,
      material: product.material,
      sku: String(product.id),
      brand: {
        "@type": "Brand",
        name: "Accordi Jewelry",
      },
      offers: {
        "@type": "Offer",
        url: canonical,
        priceCurrency: "EUR",
        price: (product.price_cents / 100).toFixed(2),
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
      },
      url: canonical,
      inLanguage: locale,
    },
    breadcrumbs: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: locale === "it" ? "Home" : "Home",
          item: absoluteUrl(locale === "en" ? "/en" : "/"),
        },
        ...(categoryPath
          ? [
              {
                "@type": "ListItem",
                position: 2,
                name: categoryLabel,
                item: absoluteUrl(categoryPath),
              },
            ]
          : []),
        {
          "@type": "ListItem",
          position: categoryPath ? 3 : 2,
          name: product.name,
          item: canonical,
        },
      ],
    },
  };
}
