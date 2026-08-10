import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Accordi Jewelry | Italian Jewelry & Gioielli Italiani",
    template: "%s | Accordi Jewelry",
  },
  description:
    "Accordi Jewelry e un e-commerce di gioielli italiani e Italian jewelry da donna con anelli, charm, bracciali ed idee regalo dal design contemporaneo.",
  keywords: [
    "gioielli italiani",
    "italian jewelry",
    "italian jewelry online",
    "italian jewelry brand",
    "italian jewelry for women",
    "gioielli donna online",
    "bracciali donna",
    "anelli donna",
    "charms gioielli",
    "gioielleria online italiana",
    "idee regalo gioielli donna",
  ],
  alternates: {
    canonical: "/",
    languages: {
      it: "/",
      en: "/italian-jewelry",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "Accordi Jewelry | Italian Jewelry & Gioielli Italiani",
    description:
      "Scopri gioielli italiani donna e Italian jewelry con charm, bracciali e anelli eleganti in uno storefront premium pensato per il mercato italiano e internazionale.",
    type: "website",
    locale: "it_IT",
    url: "http://localhost:3000",
    siteName: "Accordi Jewelry",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <div className="site-announcement">
              Gioielli italiani online · Spedizione gratuita sopra € 120 · Gift packaging incluso
            </div>
            <div className="site-nav-wrap">
              <nav className="site-nav">
                <div className="site-nav-group">
                  <Link href="/#shop">Nuovi arrivi</Link>
                  <Link href="/#shop">Charm</Link>
                  <Link href="/#shop">Bracciali</Link>
                  <Link href="/#shop">Anelli</Link>
                </div>
                <Link href="/" className="site-brand">
                  ACCORDI
                </Link>
                <div className="site-nav-group site-nav-group-right">
                  <Link href="/#campaign">Collezione</Link>
                  <Link href="/italian-jewelry">Italian Jewelry</Link>
                  <Link href="/privacy">Privacy</Link>
                </div>
              </nav>
            </div>
          </header>

          {children}

          <footer className="site-footer">
            <div className="site-footer-grid">
              <div>
                <p className="site-footer-eyebrow">Accordi Jewelry</p>
                <h2>Gioielleria online italiana dal carattere contemporaneo.</h2>
                <p>
                  Base e-commerce per gioielli con catalogo, carrello e checkout pensata per un
                  brand premium nel mercato italiano e per la crescita SEO internazionale su
                  keyword come Italian jewelry.
                </p>
              </div>
              <div>
                <p className="site-footer-eyebrow">Shop</p>
                <div className="site-footer-links">
                  <Link href="/#shop">Anelli</Link>
                  <Link href="/#shop">Bracciali</Link>
                  <Link href="/#shop">Charm</Link>
                  <Link href="/#campaign">Best seller</Link>
                  <Link href="/italian-jewelry">Italian Jewelry</Link>
                  <Link href="/italian-jewelry-bracelets">Italian Jewelry Bracelets</Link>
                  <Link href="/italian-charms">Italian Charms</Link>
                </div>
              </div>
              <div>
                <p className="site-footer-eyebrow">Informazioni</p>
                <div className="site-footer-links">
                  <Link href="/privacy">Privacy Policy</Link>
                  <Link href="/#cart">Shopping bag</Link>
                  <Link href="/checkout/success">Esito ordine</Link>
                  <a href="mailto:hello@accordijewelry.com">hello@accordijewelry.com</a>
                </div>
              </div>
            </div>
            <div className="site-footer-bottom">
              <span>© 2026 Accordi Jewelry</span>
              <span>Made for Italian jewelry SEO</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
