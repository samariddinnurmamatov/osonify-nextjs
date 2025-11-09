import { getTranslations } from "next-intl/server";
import { getAuthenticatedUserWithError } from "@/shared/lib/auth-ssr";
import { UserProfileCard } from "@/features/user/ui";
import type { AppLocale } from "@/shared/config/i18n";

interface HomeProps {
  params: Promise<{ locale: AppLocale }>;
}

export default async function Home({ params }: HomeProps) {
  await params; // Required in Next.js 15 - params must be awaited
  const t = await getTranslations("Home");
  
  // Get user data via SSR using reusable utility
  // This automatically checks cookies first (fast path), then API if needed
  const { user, error } = await getAuthenticatedUserWithError();
  
  // If not authenticated, show error message with details
  if (!user) {
    return (
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <div className="mt-6 p-6 bg-destructive/10 rounded-lg border border-destructive/20">
            <h2 className="text-lg font-medium mb-2 text-destructive">Error Loading User Profile</h2>
            <p className="text-sm text-muted-foreground">
              {error || "Failed to fetch user profile. Please check the console for details."}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Check browser console (F12) for more details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          
          {/* User info from /me endpoint (SSR) - using reusable component */}
          <UserProfileCard user={user} />
        </div>
      </div>
    </>
  );
}
