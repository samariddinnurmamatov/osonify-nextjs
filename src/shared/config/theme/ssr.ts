import { cookies } from "next/headers";
import { DEFAULT_THEME, THEME_COOKIE_NAME, Theme } from "./constants";

export async function readThemeFromCookies(): Promise<Theme> {
  const store = await cookies();
  const val = store.get(THEME_COOKIE_NAME)?.value as string | undefined;
  const allowed: Theme[] = ["light", "dark", "system"];
  return allowed.includes(val as Theme) ? (val as Theme) : DEFAULT_THEME;
}

export function computeInitialThemeClass(theme: Theme) {
  return theme === "dark" ? "dark" : theme === "light" ? "light" : undefined;
}

export function inlineNoFlashScript(): string {
  return `
  (() => {
    try {
      var m = document.cookie.match(/(?:^|; )${THEME_COOKIE_NAME}=([^;]+)/);
      var v = m ? decodeURIComponent(m[1]) : '${DEFAULT_THEME}';
      var dark = v === 'dark' || (v !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      var r = document.documentElement;
      if (dark) { r.classList.add('dark'); r.classList.remove('light'); }
      else { r.classList.add('light'); r.classList.remove('dark'); }
    } catch (e) {}
  })();
  `;
}



