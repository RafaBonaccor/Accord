export type Locale = "it" | "en";

export function normalizeLocale(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "it";
}

export function localizedPath(locale: Locale, path: string): string {
  if (!path.startsWith("/")) {
    return path;
  }

  if (locale === "en") {
    return path === "/" ? "/en" : `/en${path}`;
  }

  return path === "/en" ? "/" : path;
}
