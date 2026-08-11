import type { Metadata } from "next";

import { Storefront } from "../../components/storefront";
import { getProducts } from "../../lib/api";

export const metadata: Metadata = {
  title: "Italian Jewelry Online Store",
  description:
    "Shop Italian jewelry online with charms, rings and bracelets designed for women who want an elevated bilingual shopping experience.",
  alternates: {
    canonical: "/en",
    languages: {
      en: "/en",
      it: "/",
      "x-default": "/en",
    },
  },
  openGraph: {
    title: "Accordi Jewelry | English Store",
    description:
      "Browse charms, bracelets and rings in English with a premium jewelry storefront built for international customers.",
    url: "http://localhost:3000/en",
    locale: "en_US",
    type: "website",
  },
};

export default async function EnglishHomePage() {
  const products = await getProducts();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: "Accordi Jewelry",
    image: products[0]?.image_url,
    url: "http://localhost:3000/en",
    description:
      "English storefront for Italian jewelry with charms, rings, bracelets and gift-ready styling.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IT",
    },
    areaServed: ["IT", "US", "GB", "EU"],
    inLanguage: "en",
    knowsAbout: [
      "Italian jewelry",
      "jewelry gifts for women",
      "bracelets",
      "rings",
      "charms",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Storefront products={products} locale="en" />
    </>
  );
}
