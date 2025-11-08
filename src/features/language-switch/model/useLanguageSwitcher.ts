"use client";

import { useCallback, useEffect, useState } from "react";
import { AppLocale, routing } from "@/shared/config/i18n";
import { useRouter, usePathname } from "@/shared/config/i18n/navigation";

const REOPEN_STORAGE_KEY = "config_drawer_reopen";

export function useLanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState<AppLocale>(routing.defaultLocale);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathSegments = window.location.pathname.split("/").filter(Boolean);
      if (pathSegments.length > 0 && routing.locales.includes(pathSegments[0] as AppLocale)) {
        setCurrentLocale(pathSegments[0] as AppLocale);
      }
    }
  }, []);

  const changeLocale = useCallback(
    async (locale: AppLocale) => {
      if (currentLocale === locale) return;
      setCurrentLocale(locale);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(REOPEN_STORAGE_KEY, "true");
      }
      try {
        await router.replace(pathname, { locale });
      } finally {
        if (typeof window !== "undefined") {
          window.setTimeout(() => {
            sessionStorage.removeItem(REOPEN_STORAGE_KEY);
          }, 300);
        }
      }
    },
    [currentLocale, pathname, router]
  );

  return { currentLocale, changeLocale } as const;
}


