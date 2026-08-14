import type { Metadata } from "next";
import { DocumentLocale } from "../components/document-locale";
import { SiteChrome } from "../components/site-chrome";
import { SITE_URL } from "../lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
      en: "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "Accordi Jewelry | Italian Jewelry & Gioielli Italiani",
    description:
      "Scopri gioielli italiani da donna con charm, bracciali e anelli eleganti dal gusto contemporaneo.",
    type: "website",
    locale: "it_IT",
    url: SITE_URL,
    siteName: "Accordi Jewelry",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html suppressHydrationWarning>
      <body>
        <DocumentLocale />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
