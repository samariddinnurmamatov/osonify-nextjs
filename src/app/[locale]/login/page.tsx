"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { User } from "lucide-react";
import {
  TelegramLoginWidget,
  DebugLoginModal,
  DebugModeIndicator,
  useAuthStore,
  isDebugMode,
  useSessionManager,
} from "@/features/auth";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDebugLoginModal, setShowDebugLoginModal] = useState(false);

  // Initialize session
  useSessionManager();

  // Check if already authenticated
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleLoginClick = () => {
    if (isDebugMode()) {
      setShowDebugLoginModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <DebugModeIndicator />
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-sm border-none shadow-none bg-transparent">
          <CardContent className="flex flex-col items-center text-center space-y-5">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-[#FE4838] flex items-center justify-center">
                <User className="text-white w-10 h-10" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Osonify.ai
              </h1>
              <p className="text-sm text-muted-foreground">{t("please_login")}</p>
            </div>

            <Button
              onClick={handleLoginClick}
              variant="default"
              className="bg-[#FE4838] hover:bg-[#e84133] text-white font-medium rounded-md px-6"
            >
              <User className="mr-2 h-4 w-4" />
              {isDebugMode() ? t("debug_login") : t("login_with_telegram")}
            </Button>

            {showLoginModal && !isDebugMode() && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <Card className="max-w-sm w-full">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-medium mb-3">{t("login_to_osonify")}</h2>
                    <p className="text-xs text-muted-foreground mb-4">
                      {t("use_telegram_to_login")}
                    </p>
                    <TelegramLoginWidget
                      className="flex justify-center"
                      buttonSize="large"
                      onSuccess={() => {
                        setShowLoginModal(false);
                        router.push("/");
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => setShowLoginModal(false)}
                      className="mt-3 w-full"
                    >
                      {t("cancel")}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            <DebugLoginModal
              isOpen={showDebugLoginModal}
              onClose={() => setShowDebugLoginModal(false)}
              onSuccess={() => {
                setShowDebugLoginModal(false);
                router.push("/");
              }}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
