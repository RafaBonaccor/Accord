const BASE_URL = "http://localhost:3000";

const urls = [
  {
    loc: `${BASE_URL}/`,
    lastmod: "2026-08-10",
    changefreq: "weekly",
    priority: "1.0",
    alternates: [
      { hreflang: "it", href: `${BASE_URL}/` },
      { hreflang: "en", href: `${BASE_URL}/italian-jewelry` },
    ],
  },
  {
    loc: `${BASE_URL}/privacy`,
    lastmod: "2026-08-10",
    changefreq: "yearly",
    priority: "0.3",
    alternates: [],
  },
  {
    loc: `${BASE_URL}/italian-jewelry`,
    lastmod: "2026-08-10",
    changefreq: "weekly",
    priority: "0.85",
    alternates: [
      { hreflang: "en", href: `${BASE_URL}/italian-jewelry` },
      { hreflang: "it", href: `${BASE_URL}/` },
    ],
  },
  {
    loc: `${BASE_URL}/italian-jewelry-bracelets`,
    lastmod: "2026-08-10",
    changefreq: "weekly",
    priority: "0.8",
    alternates: [
      { hreflang: "en", href: `${BASE_URL}/italian-jewelry-bracelets` },
      { hreflang: "it", href: `${BASE_URL}/` },
    ],
  },
  {
    loc: `${BASE_URL}/italian-charms`,
    lastmod: "2026-08-10",
    changefreq: "weekly",
    priority: "0.78",
    alternates: [
      { hreflang: "en", href: `${BASE_URL}/italian-charms` },
      { hreflang: "it", href: `${BASE_URL}/` },
    ],
  },
];

export function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
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
