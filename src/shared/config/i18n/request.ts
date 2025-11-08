import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const candidate = await requestLocale;
  const locales = routing.locales as readonly string[];
  const locale =
    candidate && locales.includes(candidate)
      ? (candidate as string)
      : routing.defaultLocale;
  const messages = (await import(`./messages/${locale}.json`)).default;
  return {
    locale,
    messages,
  };
});
