"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { normalizeLocale } from "../lib/i18n";

export function DocumentLocale() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = normalizeLocale(pathname);
  }, [pathname]);

  return null;
}
