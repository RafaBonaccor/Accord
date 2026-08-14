import type { Metadata } from "next";

import { Locale } from "./i18n";

export const CATALOG_PAGE_SIZE = 2;

export type PaginatedResult<T> = {
  items: T[];
  currentPage: number;
  totalPages: number;
};

export function parsePageParam(page: string | string[] | undefined): number {
  const value = Array.isArray(page) ? page[0] : page;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }
  return Math.floor(parsed);
}

export function paginateItems<T>(items: T[], currentPage: number, pageSize = CATALOG_PAGE_SIZE): PaginatedResult<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    currentPage: safePage,
    totalPages,
  };
}

export function pagePath(basePath: string, page: number): string {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}

type CatalogMetadataOptions = {
  title: string;
  description: string;
  locale: Locale;
  currentPage: number;
  basePath: string;
  alternateBasePath: string;
};

export function buildCatalogMetadata(options: CatalogMetadataOptions): Metadata {
  const { title, description, locale, currentPage, basePath, alternateBasePath } = options;
  const suffix = currentPage > 1 ? ` - Page ${currentPage}` : "";
  const localizedSuffix = currentPage > 1 && locale === "it" ? ` - Pagina ${currentPage}` : suffix;
  const canonical = pagePath(basePath, currentPage);
  const alternate = pagePath(alternateBasePath, currentPage);

  return {
    title: `${title}${localizedSuffix}`,
    description,
    alternates: {
      canonical,
      languages: {
        [locale]: canonical,
        [locale === "it" ? "en" : "it"]: alternate,
      },
    },
  };
}
