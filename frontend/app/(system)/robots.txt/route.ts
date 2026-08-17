import { SITE_URL } from "../../../lib/site";

export function GET() {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /admin/",
    "Disallow: /admin-api/",
    "Disallow: /api/",
    "Disallow: /cart",
    "Disallow: /en/cart",
    "Disallow: /checkout/",
    "Disallow: /en/checkout/",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    `Host: ${SITE_URL}`,
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
