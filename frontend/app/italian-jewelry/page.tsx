import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Italian Jewelry for Women",
  description:
    "Explore Italian jewelry for women with elegant charms, rings and bracelets inspired by contemporary design and premium gifting.",
  alternates: {
    canonical: "/italian-jewelry",
    languages: {
      en: "/italian-jewelry",
      it: "/",
      "x-default": "/italian-jewelry",
    },
  },
  openGraph: {
    title: "Italian Jewelry for Women | Accordi Jewelry",
    description:
      "Discover Italian jewelry online with charms, bracelets and rings designed for gifting, layering and everyday elegance.",
    url: "http://localhost:3000/italian-jewelry",
    type: "website",
  },
};

const sections = [
  {
    title: "Italian jewelry with a contemporary retail feel",
    body:
      "Accordi Jewelry presents an Italian jewelry direction built around luminous finishes, gift-ready styling and a premium online shopping experience.",
  },
  {
    title: "Charm bracelets, rings and elevated gift ideas",
    body:
      "The collection language is designed to capture searches for Italian jewelry online, women’s jewelry gifts, modern charm bracelets and stackable rings.",
  },
  {
    title: "Made for bilingual SEO growth",
    body:
      "This landing page complements the Italian homepage by targeting English-language discovery while keeping a clear connection to Italian design identity.",
  },
];

export default function ItalianJewelryPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Italian Jewelry",
    url: "http://localhost:3000/italian-jewelry",
    inLanguage: "en",
    about: ["Italian jewelry", "women's jewelry", "charms", "bracelets", "rings"],
    isPartOf: "http://localhost:3000",
  };

  return (
    <main className="english-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="english-hero">
        <div className="english-hero-copy">
          <p className="legal-eyebrow">Italian Jewelry</p>
          <h1>Italian jewelry online for women who shop elegance, gifting and layering.</h1>
          <p className="legal-lead">
            This page is built for English-language searches around Italian jewelry, Italian
            jewelry online and premium jewelry gifts, while staying aligned with the brand’s
            Italian visual identity.
          </p>
          <div className="english-actions">
            <Link href="/#shop" className="english-primary">
              Shop jewelry
            </Link>
            <Link href="/" className="english-secondary">
              View Italian homepage
            </Link>
          </div>
        </div>
        <div className="english-hero-panel">
          <p className="site-footer-eyebrow">SEO Focus</p>
          <h2>Italian jewelry, modern gifting, premium women’s pieces.</h2>
          <p>
            Built to support broader discovery beyond Italy, including English-speaking audiences
            looking for refined jewelry with an Italian point of view.
          </p>
        </div>
      </section>

      <section className="english-grid">
        {sections.map((section) => (
          <article key={section.title} className="english-card">
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>

      <section className="english-copy-block">
        <p className="legal-eyebrow">Why this page exists</p>
        <h2>English SEO needs dedicated content, not just translated keywords.</h2>
        <p>
          Search visibility for terms like <strong>Italian jewelry</strong>,
          {" "}
          <strong>Italian jewelry online</strong>
          {" "}
          and
          {" "}
          <strong>Italian jewelry for women</strong>
          {" "}
          improves when the site includes a dedicated landing page with focused copy, metadata and
          internal links. This page supports that strategy directly.
        </p>
        <p className="english-inline-links">
          <Link href="/">Italian homepage</Link>
          <span>·</span>
          <Link href="/#shop">Shop the collection</Link>
          <span>·</span>
          <Link href="/italian-jewelry-bracelets">Italian jewelry bracelets</Link>
          <span>·</span>
          <Link href="/italian-charms">Italian charms</Link>
          <span>·</span>
          <Link href="/privacy">Privacy policy</Link>
        </p>
      </section>
    </main>
  );
}
