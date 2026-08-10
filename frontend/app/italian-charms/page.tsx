import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Italian Charms Jewelry",
  description:
    "Discover Italian charms jewelry with collectible details, gift-ready styling and a premium women’s jewelry direction for English-speaking shoppers.",
  alternates: {
    canonical: "/italian-charms",
    languages: {
      en: "/italian-charms",
      it: "/",
      "x-default": "/italian-charms",
    },
  },
  openGraph: {
    title: "Italian Charms Jewelry | Accordi Jewelry",
    description:
      "Explore Italian charms jewelry designed for collecting, gifting and modern bracelet storytelling.",
    url: "http://localhost:3000/italian-charms",
    type: "website",
  },
};

const charmSections = [
  {
    title: "Italian charms jewelry with collectible appeal",
    body:
      "This page supports shoppers looking for Italian charms, charm jewelry and collectible pieces with an elegant premium look.",
  },
  {
    title: "Giftable pieces with emotional storytelling",
    body:
      "Charm-focused pages are useful for searchers interested in symbolic gifts, personalized jewelry and stackable bracelet accessories.",
  },
  {
    title: "A broader English SEO cluster",
    body:
      "Adding a charms-focused page helps search engines understand that the site covers multiple jewelry subcategories in English, not just one generic landing.",
  },
];

export default function ItalianCharmsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Italian Charms Jewelry",
    url: "http://localhost:3000/italian-charms",
    inLanguage: "en",
    about: ["Italian charms", "charm jewelry", "collectible charms", "bracelet charms"],
    isPartOf: "http://localhost:3000/italian-jewelry",
  };

  return (
    <main className="english-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="english-hero">
        <div className="english-hero-copy">
          <p className="legal-eyebrow">Italian Charms</p>
          <h1>Italian charms jewelry for collecting, gifting and personal storytelling.</h1>
          <p className="legal-lead">
            This page is designed for English-language searches around Italian charms, charm
            jewelry, collectible jewelry details and premium bracelet accessories.
          </p>
          <div className="english-actions">
            <Link href="/#shop" className="english-primary">
              Shop charms
            </Link>
            <Link href="/italian-jewelry" className="english-secondary">
              View Italian jewelry page
            </Link>
          </div>
        </div>
        <div className="english-hero-panel">
          <p className="site-footer-eyebrow">Charm SEO</p>
          <h2>Made for symbolic gifts and collectible jewelry intent.</h2>
          <p>
            Charm pages help capture more emotional, gift-oriented searches and add depth to the
            English-language structure around Italian jewelry.
          </p>
        </div>
      </section>

      <section className="english-grid">
        {charmSections.map((section) => (
          <article key={section.title} className="english-card">
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>

      <section className="english-copy-block">
        <p className="legal-eyebrow">Related English cluster</p>
        <h2>Charms add a personalized angle to the international jewelry strategy.</h2>
        <p>
          Search terms like <strong>Italian charms</strong> and <strong>Italian charms jewelry</strong>
          expand the site beyond broad discovery and support users looking for collectible,
          expressive and gift-led jewelry content in English.
        </p>
        <p className="english-inline-links">
          <Link href="/italian-jewelry">Italian jewelry landing</Link>
          <span>·</span>
          <Link href="/italian-jewelry-bracelets">Italian jewelry bracelets</Link>
          <span>·</span>
          <Link href="/">Italian homepage</Link>
        </p>
      </section>
    </main>
  );
}
