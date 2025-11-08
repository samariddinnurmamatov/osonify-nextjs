export const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
export const THEME_COOKIE_NAME = "vite-ui-theme";
export const LAYOUT_VARIANT_COOKIE_NAME = "layout_variant";
export const LAYOUT_COLLAPSIBLE_COOKIE_NAME = "layout_collapsible";
export const DIRECTION_COOKIE_NAME = "dir";


export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue ? decodeURIComponent(cookieValue) : undefined;
  }
  return undefined;
}

export function setCookie(name: string, value: string, maxAge: number = DEFAULT_MAX_AGE) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}`;
}

export function removeCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}
