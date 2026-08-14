import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Italian Jewelry Bracelets",
  description:
    "Discover Italian jewelry bracelets with elegant finishes, luminous details and a contemporary feminine feel.",
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
      "Explore Italian jewelry bracelets designed for layering and everyday elegance.",
    url: "http://localhost:3000/italian-jewelry-bracelets",
    type: "website",
  },
};

const braceletPoints = [
  {
    title: "Bracelets with a luminous, feminine feel",
    body: "Refined bracelet styles with elegant finishes and effortless wearability.",
  },
  {
    title: "Layering and everyday styling",
    body:
      "Bracelets created to be stacked naturally or worn alone with understated elegance.",
  },
  {
    title: "A modern Italian touch",
    body:
      "Clean silhouettes and gift-ready details define this bracelet-focused edit.",
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
          <h1>Italian jewelry bracelets designed for layering, light and modern elegance.</h1>
          <p className="legal-lead">
            Discover bracelet styles made to layer beautifully and wear every day with ease.
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
          <p className="site-footer-eyebrow">Bracelet Edit</p>
          <h2>Contemporary bracelets with light, movement and everyday shine.</h2>
          <p>
            A focused selection of bracelet styles that feels elegant, modern and easy to choose.
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
        <p className="legal-eyebrow">Discover More</p>
        <h2>Complete the look with charms and the wider Italian jewelry selection.</h2>
        <p>
          Explore complementary pieces designed to pair naturally with bracelets, from expressive
          charms to signature jewelry styles.
        </p>
        <p className="english-inline-links">
          <Link href="/italian-jewelry">Italian jewelry</Link>
          <span>·</span>
          <Link href="/charms">Charms</Link>
          <span>·</span>
          <Link href="/">Homepage</Link>
          <span>·</span>
          <Link href="/privacy">Privacy policy</Link>
        </p>
      </section>
    </main>
  );
}
