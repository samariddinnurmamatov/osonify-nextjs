import type { UrlObject } from "url";
import { routing } from "@/shared/config/i18n";

/**
 * Strips locale prefix from pathname
 * Removes the locale segment from the beginning of a pathname
 * 
 * @param pathname - Full pathname with potential locale prefix
 * @returns Pathname without locale prefix
 * 
 * @example
 * ```ts
 * stripLocale("/uz/dashboard") // "/dashboard"
 * stripLocale("/en/settings") // "/settings"
 * stripLocale("/dashboard") // "/dashboard"
 * ```
 */
export function stripLocale(pathname: string): string {
  const locales = routing.locales;
  const parts = pathname.split("/").filter(Boolean);
  
  if (parts.length > 0 && locales.includes(parts[0] as typeof locales[number])) {
    return "/" + parts.slice(1).join("/");
  }
  
  return pathname;
}

/**
 * Normalizes URL object or string to a string pathname
 * Converts Next.js Link href format to a comparable string
 * 
 * @param url - URL object or string
 * @returns Normalized pathname string
 * 
 * @example
 * ```ts
 * normalizeUrl("/dashboard") // "/dashboard"
 * normalizeUrl({ pathname: "/settings", query: { tab: "profile" } }) // "/settings?tab=profile"
 * ```
 */
export function normalizeUrl(url: UrlObject | string): string {
  if (typeof url === "string") {
    return url;
  }
  
  const pathname = url.pathname ?? "";
  const query = url.query
    ? "?" +
      Object.entries(url.query)
        .map(([k, v]) => `${k}=${v}`)
        .join("&")
    : "";
  const hash = url.hash ?? "";
  
  return `${pathname}${query}${hash}`;
}

