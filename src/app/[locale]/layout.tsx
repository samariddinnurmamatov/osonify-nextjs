import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

import { routing, AppLocale } from "@/shared/config/i18n";
import {
  readThemeFromCookies,
  computeInitialThemeClass,
  inlineNoFlashScript,
} from "@/shared/config/theme/ssr";

import { AppProviders } from "../providers";
import { SidebarProvider, SidebarInset } from "@/shared/ui/sidebar";
import { AppSidebar, Header, Main, HeaderActions } from "@/widgets/layout";
import { cn } from "@/shared/lib/utils";

import "../globals.css";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const validLocale = locale as AppLocale;
  if (!routing.locales.includes(validLocale)) notFound();

  const [messages, cookieStore, theme] = await Promise.all([
    getMessages({ locale: validLocale }),
    cookies(),
    readThemeFromCookies(),
  ]);

  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";
  const htmlClass = computeInitialThemeClass(theme);

  return (
    <html lang={validLocale} className={htmlClass} suppressHydrationWarning>
      <head>
        <title>Osonify Admin</title>
        <meta name="description" content="Osonify Admin Panel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: inlineNoFlashScript() }} />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider locale={validLocale} messages={messages}>
          <AppProviders defaultTheme={theme}>
            <SidebarProvider defaultOpen={defaultOpen}>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <SidebarInset
                  className={cn(
                    "flex flex-col flex-1 min-h-screen bg-background",
                    "@container/content"
                  )}
                >
                  <Header fixed>
                    <HeaderActions />
                  </Header>
                  <Main>{children}</Main>
                </SidebarInset>
              </div>
            </SidebarProvider>
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
