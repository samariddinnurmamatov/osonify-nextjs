"use client";

import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { env } from "@/shared/config/env";
import { toast } from "@/shared/stores/toastStore";
import { LoginModal } from "./LoginModal";

export function TelegramLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const isDevelopment = env.NEXT_PUBLIC_APP_ENV === "development";

  // Check if we're in Telegram WebApp
  const isTelegramWebApp =
    typeof window !== "undefined" && !!window.Telegram?.WebApp?.initData;

  useEffect(() => {
    // Initialize Telegram WebApp if available
    if (isTelegramWebApp && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready?.();
      window.Telegram.WebApp.expand?.();
    }
  }, [isTelegramWebApp]);

  const handleTelegramWebAppLogin = async () => {
    if (!isTelegramWebApp || !window.Telegram?.WebApp?.initData) {
      return;
    }

    setIsLoading(true);
    try {
      const initData = window.Telegram.WebApp.initData;
      const response = await fetch(
        `/api/auth/webapp?init_data=${encodeURIComponent(initData)}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
      }

      toast.success("Success", "Logged in successfully");
      window.location.href = "/";
    } catch (error) {
      toast.error(
        "Login Failed",
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (isTelegramWebApp) {
      handleTelegramWebAppLogin();
    } else {
      // Open login modal (will show Telegram widget in production or token input in debug)
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        {isTelegramWebApp ? (
          <Button
            onClick={handleTelegramWebAppLogin}
            disabled={isLoading}
            className="bg-[#0088cc] hover:bg-[#0077b5] text-white font-medium rounded-md px-6"
          >
            {isLoading ? (
              "Logging in..."
            ) : (
              <>
                <User className="mr-2 h-4 w-4" /> Login with Telegram
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleButtonClick}
            disabled={isLoading}
            className="bg-[#FE4838] hover:bg-[#e84133] text-white font-medium rounded-md px-6"
          >
            <User className="mr-2 h-4 w-4" />
            {isDevelopment ? "Debug Login" : "Login with Telegram"}
          </Button>
        )}
      </div>

      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onSuccess={() => {
          window.location.href = "/";
        }}
      />
    </>
  );
}
