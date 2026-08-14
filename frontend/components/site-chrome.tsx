"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCart } from "../hooks/use-cart";
import { navCopy } from "../lib/copy";
import { localizedPath, normalizeLocale } from "../lib/i18n";
import { routeFor } from "../lib/routes";

export function SiteChrome({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const locale = normalizeLocale(pathname);
  const copy = navCopy[locale];
  const storePath = localizedPath(locale, "/");
  const privacyPath = routeFor(locale, "privacy");
  const checkoutSuccessPath = localizedPath(locale, "/checkout/success");
  const newPath = routeFor(locale, "new");
  const charmsPath = routeFor(locale, "charms");
  const braceletsPath = routeFor(locale, "bracelets");
  const ringsPath = routeFor(locale, "rings");
  const earringsPath = routeFor(locale, "earrings");
  const necklacesPath = routeFor(locale, "necklaces");
  const collectionPath = routeFor(locale, "collection");
  const cartPath = routeFor(locale, "cart");
  const brandPath = routeFor(locale, "brand");
  const bestSellerPath = routeFor(locale, "bestsellers");
  const giftGuidePath = routeFor(locale, "giftguide");
  const storeLocatorPath = routeFor(locale, "stores");
  const journalPath = routeFor(locale, "journal");
  const { itemCount } = useCart();

  return (
    <div className="site-shell" data-locale={locale}>
      <header className="site-header">
        <div className="site-announcement">{copy.announcement}</div>
        <div className="site-nav-wrap">
          <nav className="site-nav">
            <div className="site-nav-group">
              <Link href={newPath}>{copy.navLeft[0]}</Link>
              <Link href={charmsPath}>{copy.navLeft[1]}</Link>
              <Link href={braceletsPath}>{copy.navLeft[2]}</Link>
              <Link href={ringsPath}>{copy.navLeft[3]}</Link>
            </div>
            <Link href={storePath} className="site-brand">
              ACCORDI
            </Link>
            <div className="site-nav-group site-nav-group-right">
              <Link href={collectionPath}>{copy.navRightCollection}</Link>
              <Link href={privacyPath}>{copy.navRightPrivacy}</Link>
              <Link href={cartPath} className="site-cart-link" aria-label={`${copy.navCart} (${itemCount})`}>
                <span aria-hidden="true">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.5 5H5.1C5.48 5 5.82 5.25 5.93 5.61L6.58 7.75M6.58 7.75H18.55C19.26 7.75 19.79 8.41 19.63 9.1L18.54 13.85C18.42 14.36 17.97 14.72 17.45 14.72H8.21C7.7 14.72 7.25 14.38 7.11 13.89L6.58 7.75Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.75 18.25C8.75 18.94 8.19 19.5 7.5 19.5C6.81 19.5 6.25 18.94 6.25 18.25C6.25 17.56 6.81 17 7.5 17C8.19 17 8.75 17.56 8.75 18.25Z"
                      fill="currentColor"
                    />
                    <path
                      d="M18.25 18.25C18.25 18.94 17.69 19.5 17 19.5C16.31 19.5 15.75 18.94 15.75 18.25C15.75 17.56 16.31 17 17 17C17.69 17 18.25 17.56 18.25 18.25Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span className="site-cart-badge">{itemCount}</span>
              </Link>
              <div className="site-language-switch" aria-label="Language switcher">
                <Link href="/" className={locale === "it" ? "is-active" : undefined}>
                  IT
                </Link>
                <span>/</span>
                <Link href="/en" className={locale === "en" ? "is-active" : undefined}>
                  EN
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {children}

      <footer className="site-footer">
        <div className="site-footer-grid">
          <div>
            <p className="site-footer-eyebrow">Accordi Jewelry</p>
            <h2>{copy.footerIntroTitle}</h2>
            <p>{copy.footerIntroBody}</p>
          </div>
          <div>
            <p className="site-footer-eyebrow">{copy.footerShopLabel}</p>
            <div className="site-footer-links">
              <Link href={ringsPath}>{copy.footerCategories.rings}</Link>
              <Link href={braceletsPath}>{copy.footerCategories.bracelets}</Link>
              <Link href={charmsPath}>{copy.footerCategories.charms}</Link>
              <Link href={earringsPath}>{copy.footerCategories.earrings}</Link>
              <Link href={necklacesPath}>{copy.footerCategories.necklaces}</Link>
              <Link href={collectionPath}>{copy.footerCategories.collection}</Link>
              <Link href={brandPath}>{copy.footerCategories.brand}</Link>
              <Link href={bestSellerPath}>{copy.footerCategories.bestsellers}</Link>
              <Link href={giftGuidePath}>{copy.footerCategories.giftguide}</Link>
              <Link href={storeLocatorPath}>{copy.footerCategories.stores}</Link>
              <Link href={journalPath}>{copy.footerCategories.journal}</Link>
              <Link href="/italian-jewelry">{copy.footerCategories.seo}</Link>
            </div>
          </div>
          <div>
            <p className="site-footer-eyebrow">{copy.footerInfoLabel}</p>
            <div className="site-footer-links">
              <Link href={privacyPath}>Privacy Policy</Link>
              <Link href={cartPath}>Shopping bag</Link>
              <Link href={checkoutSuccessPath}>{copy.footerOrderStatus}</Link>
              <a href="mailto:hello@accordijewelry.com">hello@accordijewelry.com</a>
            </div>
          </div>
        </div>
        <div className="site-footer-bottom">
          <span>© 2026 Accordi Jewelry</span>
          <span>{copy.footerSeoTagline}</span>
        </div>
      </footer>
    </div>
  );
}
