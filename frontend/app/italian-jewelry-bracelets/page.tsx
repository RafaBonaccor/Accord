import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Italian Jewelry Bracelets",
  description:
    "Discover Italian jewelry bracelets with elegant finishes, gift-ready styling and a premium women’s jewelry direction for international shoppers.",
  alternates: {
    canonical: "/italian-jewelry-bracelets",
    languages: {
      en: "/italian-jewelry-bracelets",
      it: "/",
      "x-default": "/italian-jewelry-bracelets",
    },
  },
  openGraph: {
    title: "Italian Jewelry Bracelets | Accordi Jewelry",
    description:
      "Explore Italian jewelry bracelets designed for layering, gifting and premium online shopping.",
    url: "http://localhost:3000/italian-jewelry-bracelets",
    type: "website",
  },
};

const braceletPoints = [
  {
    title: "Italian jewelry bracelets for gifting",
    body:
      "This page targets English-speaking shoppers looking for refined bracelet styles that feel elevated, feminine and easy to gift.",
  },
  {
    title: "Layering, charm styling and everyday wear",
    body:
      "The content supports searches around Italian bracelet styling, charm bracelets, stackable silhouettes and modern jewelry looks.",
  },
  {
    title: "SEO support for a stronger English cluster",
    body:
      "A second English landing helps search engines understand that the site covers multiple commercial intents within the Italian jewelry space.",
  },
];

export default function ItalianJewelryBraceletsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Italian Jewelry Bracelets",
    url: "http://localhost:3000/italian-jewelry-bracelets",
    inLanguage: "en",
    about: ["Italian jewelry bracelets", "bracelets for women", "charm bracelets", "layering jewelry"],
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
          <p className="legal-eyebrow">Italian Jewelry Bracelets</p>
          <h1>Italian jewelry bracelets designed for layering, gifting and modern elegance.</h1>
          <p className="legal-lead">
            This page supports searches for Italian jewelry bracelets, Italian bracelet styles and
            premium women’s jewelry with a softer, fashion-led retail positioning.
          </p>
          <div className="english-actions">
            <Link href="/#shop" className="english-primary">
              Shop bracelets
            </Link>
            <Link href="/italian-jewelry" className="english-secondary">
              View Italian jewelry page
            </Link>
          </div>
        </div>
        <div className="english-hero-panel">
          <p className="site-footer-eyebrow">Bracelet SEO</p>
          <h2>Focused on bracelet intent, not generic discovery only.</h2>
          <p>
            A specific page for bracelets broadens the site’s English-language coverage and helps
            connect category intent with the broader Italian jewelry theme.
          </p>
        </div>
      </section>

      <section className="english-grid">
        {braceletPoints.map((point) => (
          <article key={point.title} className="english-card">
            <h2>{point.title}</h2>
            <p>{point.body}</p>
          </article>
        ))}
      </section>

      <section className="english-copy-block">
        <p className="legal-eyebrow">Related English cluster</p>
        <h2>Bracelet-focused content strengthens international jewelry SEO.</h2>
        <p>
          Search visibility improves when broad terms like <strong>Italian jewelry</strong> are
          supported by category-oriented pages such as <strong>Italian jewelry bracelets</strong>.
          This gives the site a clearer content structure for English-speaking shoppers and search
          engines alike.
        </p>
        <p className="english-inline-links">
          <Link href="/italian-jewelry">Italian jewelry landing</Link>
          <span>·</span>
          <Link href="/italian-charms">Italian charms</Link>
          <span>·</span>
          <Link href="/">Italian homepage</Link>
          <span>·</span>
          <Link href="/privacy">Privacy policy</Link>
        </p>
      </section>
    </main>
  );
}
