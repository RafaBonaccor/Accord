import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Italian Jewelry for Women",
  description:
    "Explore Italian jewelry for women with elegant charms, rings and bracelets shaped by contemporary design.",
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
      "Discover Italian jewelry online with charms, bracelets and rings for layering and everyday elegance.",
    url: "http://localhost:3000/italian-jewelry",
    type: "website",
  },
};

const sections = [
  {
    title: "Jewelry with a luminous, contemporary mood",
    body:
      "Accordi Jewelry brings together refined details, feminine lines and pieces designed to be worn with ease.",
  },
  {
    title: "Charms, bracelets and rings to gift or keep",
    body:
      "The collection moves between gift-ready styles, modern layering and everyday elegance.",
  },
  {
    title: "A signature selection with Italian character",
    body:
      "Every piece is chosen to express light, simplicity and a contemporary Italian sensibility.",
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
          <h1>Italian jewelry online for women who love elegance, light and easy layering.</h1>
          <p className="legal-lead">
            Discover charms, bracelets and rings designed for everyday elegance, meaningful gifts
            and naturally layered styling.
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
          <p className="site-footer-eyebrow">Accordi Jewelry</p>
          <h2>Italian jewelry with a refined, contemporary point of view.</h2>
          <p>
            A curated selection of luminous details, elegant pieces and styles made to be
            worn every day.
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
        <p className="legal-eyebrow">Discover More</p>
        <h2>Explore the collection through bracelets, charms and the Italian homepage.</h2>
        <p>
          Browse the full world of Accordi Jewelry through category pages dedicated to bracelets,
          charms and the brand’s most loved styles.
        </p>
        <p className="english-inline-links">
          <Link href="/">Homepage</Link>
          <span>·</span>
          <Link href="/#shop">Shop the collection</Link>
          <span>·</span>
          <Link href="/italian-jewelry-bracelets">Bracelets</Link>
          <span>·</span>
          <Link href="/charms">Charms</Link>
          <span>·</span>
          <Link href="/privacy">Privacy policy</Link>
        </p>
      </section>
    </main>
  );
}
