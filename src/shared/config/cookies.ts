/**
 * Cookies Utility
 * Read/write access_token in SSR & CSR
 */

"use client";

/**
 * Get cookie value by name
 */
export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
  return undefined;
}

/**
 * Set cookie
 */
export function setCookie(
  name: string,
  value: string,
  options: {
    expires?: number; // days
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
  } = {}
): void {
  if (typeof document === "undefined") return;

  const {
    expires,
    path = "/",
    domain,
    secure = false,
    sameSite = "lax",
  } = options;

  let cookieString = `${name}=${value}; path=${path}`;

  if (expires) {
    const date = new Date();
    date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${date.toUTCString()}`;
  }

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += "; secure";
  }

  cookieString += `; sameSite=${sameSite}`;

  document.cookie = cookieString;
}

/**
 * Delete cookie
 */
export function deleteCookie(
  name: string,
  options: { path?: string; domain?: string } = {}
): void {
  if (typeof document === "undefined") return;

  const { path = "/", domain } = options;
  let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  document.cookie = cookieString;
}

