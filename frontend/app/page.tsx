import type { Metadata } from "next";
import { Storefront } from "../components/storefront";
import { getProducts } from "../lib/api";

export const metadata: Metadata = {
  title: "Italian Jewelry Online",
  description:
    "Scopri Italian jewelry e gioielli italiani donna online con charm, anelli e bracciali eleganti. Accordi Jewelry offre una base e-commerce premium ottimizzata per il mercato italiano e internazionale.",
  alternates: {
    canonical: "/",
    languages: {
      it: "/",
      en: "/en",
      "x-default": "/",
    },
  },
};

export default async function HomePage() {
  const products = await getProducts();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: "Accordi Jewelry",
    image: products[0]?.image_url,
    url: "http://localhost:3000",
    description:
      "Italian jewelry brand con charm, anelli, bracciali e idee regalo per donna.",
    inLanguage: "it",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IT",
    },
    areaServed: ["IT", "US", "GB", "EU"],
    knowsAbout: [
      "gioielli italiani",
      "italian jewelry",
      "italian jewelry online",
      "gioielli donna",
      "bracciali",
      "anelli",
      "charms",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Storefront products={products} locale="it" />
    </>
  );
}
