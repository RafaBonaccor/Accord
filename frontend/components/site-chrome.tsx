"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navCopy } from "../lib/copy";
import { localizedPath, normalizeLocale } from "../lib/i18n";

export function SiteChrome({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const locale = normalizeLocale(pathname);
  const copy = navCopy[locale];
  const storePath = localizedPath(locale, "/");
  const privacyPath = localizedPath(locale, "/privacy");
  const checkoutSuccessPath = localizedPath(locale, "/checkout/success");
  const switchPath = locale === "it" ? "/en" : "/";

  return (
    <div className="site-shell" data-locale={locale}>
      <header className="site-header">
        <div className="site-announcement">{copy.announcement}</div>
        <div className="site-nav-wrap">
          <nav className="site-nav">
            <div className="site-nav-group">
              <Link href={`${storePath}#shop`}>{copy.navLeft[0]}</Link>
              <Link href={`${storePath}#shop`}>{copy.navLeft[1]}</Link>
              <Link href={`${storePath}#shop`}>{copy.navLeft[2]}</Link>
              <Link href={`${storePath}#shop`}>{copy.navLeft[3]}</Link>
            </div>
            <Link href={storePath} className="site-brand">
              ACCORDI
            </Link>
            <div className="site-nav-group site-nav-group-right">
              <Link href={`${storePath}#campaign`}>{copy.navRightCollection}</Link>
              <Link href={switchPath}>{copy.navRightStore}</Link>
              <Link href={privacyPath}>{copy.navRightPrivacy}</Link>
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
              <Link href={`${storePath}#shop`}>{copy.navLeft[3]}</Link>
              <Link href={`${storePath}#shop`}>{copy.navLeft[2]}</Link>
              <Link href={`${storePath}#shop`}>{copy.navLeft[1]}</Link>
              <Link href={`${storePath}#campaign`}>Best seller</Link>
              <Link href="/italian-jewelry">Italian Jewelry</Link>
              <Link href="/italian-jewelry-bracelets">Italian Jewelry Bracelets</Link>
              <Link href="/italian-charms">Italian Charms</Link>
            </div>
          </div>
          <div>
            <p className="site-footer-eyebrow">{copy.footerInfoLabel}</p>
            <div className="site-footer-links">
              <Link href={privacyPath}>Privacy Policy</Link>
              <Link href={`${storePath}#cart`}>Shopping bag</Link>
              <Link href={checkoutSuccessPath}>{copy.footerOrderStatus}</Link>
              <Link href={switchPath}>{copy.languageSwitch}</Link>
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
