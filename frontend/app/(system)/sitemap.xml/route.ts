import { getProducts } from "../../../lib/api";
import { productPath } from "../../../lib/product-routes";
import { SITE_URL } from "../../../lib/site";

const BASE_URL = SITE_URL;

const urls = [
  {
    loc: `${BASE_URL}/`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "1.0",
    alternates: [
      { hreflang: "it", href: `${BASE_URL}/` },
      { hreflang: "en", href: `${BASE_URL}/en` },
    ],
  },
  {
    loc: `${BASE_URL}/privacy`,
    lastmod: "2026-08-12",
    changefreq: "yearly",
    priority: "0.3",
    alternates: [
      { hreflang: "it", href: `${BASE_URL}/privacy` },
      { hreflang: "en", href: `${BASE_URL}/en/privacy` },
    ],
  },
  {
    loc: `${BASE_URL}/en`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.95",
    alternates: [
      { hreflang: "en", href: `${BASE_URL}/en` },
      { hreflang: "it", href: `${BASE_URL}/` },
    ],
  },
  {
    loc: `${BASE_URL}/en/privacy`,
    lastmod: "2026-08-12",
    changefreq: "yearly",
    priority: "0.3",
    alternates: [
      { hreflang: "en", href: `${BASE_URL}/en/privacy` },
      { hreflang: "it", href: `${BASE_URL}/privacy` },
    ],
  },
  {
    loc: `${BASE_URL}/italian-jewelry`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.85",
    alternates: [
      { hreflang: "en", href: `${BASE_URL}/italian-jewelry` },
      { hreflang: "it", href: `${BASE_URL}/` },
    ],
  },
  {
    loc: `${BASE_URL}/italian-jewelry-bracelets`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.8",
    alternates: [
      { hreflang: "en", href: `${BASE_URL}/italian-jewelry-bracelets` },
      { hreflang: "it", href: `${BASE_URL}/` },
    ],
  },
  {
    loc: `${BASE_URL}/novita`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.88",
    alternates: [
      { hreflang: "it", href: `${BASE_URL}/novita` },
      { hreflang: "en", href: `${BASE_URL}/en/new-arrivals` },
    ],
  },
  {
    loc: `${BASE_URL}/en/new-arrivals`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.88",
    alternates: [
      { hreflang: "en", href: `${BASE_URL}/en/new-arrivals` },
      { hreflang: "it", href: `${BASE_URL}/novita` },
    ],
  },
  {
    loc: `${BASE_URL}/bracciali`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.82",
    alternates: [
      { hreflang: "it", href: `${BASE_URL}/bracciali` },
      { hreflang: "en", href: `${BASE_URL}/en/bracelets` },
    ],
  },
  {
    loc: `${BASE_URL}/en/bracelets`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.82",
    alternates: [
      { hreflang: "en", href: `${BASE_URL}/en/bracelets` },
      { hreflang: "it", href: `${BASE_URL}/bracciali` },
    ],
  },
  {
    loc: `${BASE_URL}/anelli`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.82",
    alternates: [
      { hreflang: "it", href: `${BASE_URL}/anelli` },
      { hreflang: "en", href: `${BASE_URL}/en/rings` },
    ],
  },
  {
    loc: `${BASE_URL}/en/rings`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.82",
    alternates: [
      { hreflang: "en", href: `${BASE_URL}/en/rings` },
      { hreflang: "it", href: `${BASE_URL}/anelli` },
    ],
  },
  {
    loc: `${BASE_URL}/charms`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.82",
    alternates: [
      { hreflang: "it", href: `${BASE_URL}/charms` },
      { hreflang: "en", href: `${BASE_URL}/en/charms` },
    ],
  },
  {
    loc: `${BASE_URL}/en/charms`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.82",
    alternates: [
      { hreflang: "en", href: `${BASE_URL}/en/charms` },
      { hreflang: "it", href: `${BASE_URL}/charms` },
    ],
  },
  {
    loc: `${BASE_URL}/orecchini`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.8",
    alternates: [
      { hreflang: "it", href: `${BASE_URL}/orecchini` },
      { hreflang: "en", href: `${BASE_URL}/en/earrings` },
    ],
  },
  {
    loc: `${BASE_URL}/en/earrings`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.8",
    alternates: [
      { hreflang: "en", href: `${BASE_URL}/en/earrings` },
      { hreflang: "it", href: `${BASE_URL}/orecchini` },
    ],
  },
  {
    loc: `${BASE_URL}/collane`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.8",
    alternates: [
      { hreflang: "it", href: `${BASE_URL}/collane` },
      { hreflang: "en", href: `${BASE_URL}/en/necklaces` },
    ],
  },
  {
    loc: `${BASE_URL}/en/necklaces`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.8",
    alternates: [
      { hreflang: "en", href: `${BASE_URL}/en/necklaces` },
      { hreflang: "it", href: `${BASE_URL}/collane` },
    ],
  },
  {
    loc: `${BASE_URL}/collezione`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.84",
    alternates: [
      { hreflang: "it", href: `${BASE_URL}/collezione` },
      { hreflang: "en", href: `${BASE_URL}/en/collection` },
    ],
  },
  {
    loc: `${BASE_URL}/en/collection`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.84",
    alternates: [
      { hreflang: "en", href: `${BASE_URL}/en/collection` },
      { hreflang: "it", href: `${BASE_URL}/collezione` },
    ],
  },
  {
    loc: `${BASE_URL}/brand`,
    lastmod: "2026-08-12",
    changefreq: "monthly",
    priority: "0.68",
    alternates: [
      { hreflang: "it", href: `${BASE_URL}/brand` },
      { hreflang: "en", href: `${BASE_URL}/en/brand` },
    ],
  },
  {
    loc: `${BASE_URL}/en/brand`,
    lastmod: "2026-08-12",
    changefreq: "monthly",
    priority: "0.68",
    alternates: [
      { hreflang: "en", href: `${BASE_URL}/en/brand` },
      { hreflang: "it", href: `${BASE_URL}/brand` },
    ],
  },
  {
    loc: `${BASE_URL}/best-seller`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.8",
    alternates: [
      { hreflang: "it", href: `${BASE_URL}/best-seller` },
      { hreflang: "en", href: `${BASE_URL}/en/best-sellers` },
    ],
  },
  {
    loc: `${BASE_URL}/en/best-sellers`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.8",
    alternates: [
      { hreflang: "en", href: `${BASE_URL}/en/best-sellers` },
      { hreflang: "it", href: `${BASE_URL}/best-seller` },
    ],
  },
  {
    loc: `${BASE_URL}/gift-guide`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.76",
    alternates: [
      { hreflang: "it", href: `${BASE_URL}/gift-guide` },
      { hreflang: "en", href: `${BASE_URL}/en/gift-guide` },
    ],
  },
  {
    loc: `${BASE_URL}/en/gift-guide`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.76",
    alternates: [
      { hreflang: "en", href: `${BASE_URL}/en/gift-guide` },
      { hreflang: "it", href: `${BASE_URL}/gift-guide` },
    ],
  },
  {
    loc: `${BASE_URL}/store-locator`,
    lastmod: "2026-08-12",
    changefreq: "monthly",
    priority: "0.62",
    alternates: [
      { hreflang: "it", href: `${BASE_URL}/store-locator` },
      { hreflang: "en", href: `${BASE_URL}/en/store-locator` },
    ],
  },
  {
    loc: `${BASE_URL}/en/store-locator`,
    lastmod: "2026-08-12",
    changefreq: "monthly",
    priority: "0.62",
    alternates: [
      { hreflang: "en", href: `${BASE_URL}/en/store-locator` },
      { hreflang: "it", href: `${BASE_URL}/store-locator` },
    ],
  },
  {
    loc: `${BASE_URL}/journal`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.66",
    alternates: [
      { hreflang: "it", href: `${BASE_URL}/journal` },
      { hreflang: "en", href: `${BASE_URL}/en/journal` },
    ],
  },
  {
    loc: `${BASE_URL}/en/journal`,
    lastmod: "2026-08-12",
    changefreq: "weekly",
    priority: "0.66",
    alternates: [
      { hreflang: "en", href: `${BASE_URL}/en/journal` },
      { hreflang: "it", href: `${BASE_URL}/journal` },
    ],
  },
];

export async function GET() {
  const products = await getProducts();
  const productUrls = products.flatMap((product) => [
    {
      loc: `${BASE_URL}${productPath("it", product.slug)}`,
      lastmod: "2026-08-12",
      changefreq: "weekly",
      priority: "0.76",
      alternates: [
        { hreflang: "it", href: `${BASE_URL}${productPath("it", product.slug)}` },
        { hreflang: "en", href: `${BASE_URL}${productPath("en", product.slug)}` },
      ],
    },
    {
      loc: `${BASE_URL}${productPath("en", product.slug)}`,
      lastmod: "2026-08-12",
      changefreq: "weekly",
      priority: "0.76",
      alternates: [
        { hreflang: "en", href: `${BASE_URL}${productPath("en", product.slug)}` },
        { hreflang: "it", href: `${BASE_URL}${productPath("it", product.slug)}` },
      ],
    },
  ]);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...urls, ...productUrls]
  .map(
    (url) => `<url>
  <loc>${url.loc}</loc>
  <lastmod>${url.lastmod}</lastmod>
  <changefreq>${url.changefreq}</changefreq>
  <priority>${url.priority}</priority>
${url.alternates
  .map((alternate) => `  <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${alternate.href}" />`)
  .join("\n")}
</url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
