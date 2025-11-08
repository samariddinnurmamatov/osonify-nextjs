"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "../model";
import { AuthService } from "../api/auth-service";
import { userService } from "@/shared/api/services";
import { env } from "@/shared/config/env";

interface TelegramLoginWidgetProps {
  botUsername?: string;
  buttonSize?: "small" | "medium" | "large";
  cornerRadius?: number;
  requestAccess?: boolean;
  usePic?: boolean;
  className?: string;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData?: string;
      };
    };
    TelegramLoginWidget?: {
      dataOnauth: (user: any) => void;
    };
  }
}

export function TelegramLoginWidget({
  botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "osonifybot",
  buttonSize = "large",
  cornerRadius = 10,
  requestAccess = true,
  usePic = true,
  className = "",
  onSuccess,
}: TelegramLoginWidgetProps) {
  const t = useTranslations("auth");
  const containerRef = useRef<HTMLDivElement>(null);
  const { setAuth, setLoading, isLoading } = useAuthStore();
  const [isMiniApp, setIsMiniApp] = useState(false);

  useEffect(() => {
    // Check if Telegram Mini App
    const tg = typeof window !== "undefined" ? window.Telegram?.WebApp : null;
    const hasInitData = tg?.initData;

    if (hasInitData) {
      setIsMiniApp(true);
      setLoading(true);
      
      (async () => {
        try {
          const initData = tg!.initData!;
          const authResponse = await AuthService.loginWithWebApp(initData);
          const profile = await userService.getProfile();
          setAuth(authResponse, profile);
          onSuccess?.();
        } catch (error) {
          console.error("MiniApp login failed:", error);
          setLoading(false);
        }
      })();
      return;
    }

    // Browser login (widget.js)
    if (typeof window === "undefined" || !containerRef.current) return;

    window.TelegramLoginWidget = {
      dataOnauth: async (user: any) => {
        setLoading(true);
        try {
          const authResponse = await AuthService.loginWithTelegram(user);
          const profile = await userService.getProfile();
          setAuth(authResponse, profile);
          onSuccess?.();
        } catch (error) {
          console.error("Login failed:", error);
          setLoading(false);
        }
      },
    };

    if (!containerRef.current.querySelector("script")) {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.setAttribute("data-telegram-login", botUsername);
      script.setAttribute("data-size", buttonSize);
      script.setAttribute("data-corner-radius", String(cornerRadius));
      script.setAttribute("data-request-access", requestAccess ? "write" : "");
      script.setAttribute("data-userpic", String(usePic));
      script.setAttribute(
        "data-onauth",
        "TelegramLoginWidget.dataOnauth(user)"
      );
      containerRef.current.appendChild(script);
    }

    return () => {
      if (typeof window !== "undefined") {
        delete window.TelegramLoginWidget;
      }
    };
  }, [
    botUsername,
    buttonSize,
    cornerRadius,
    requestAccess,
    usePic,
    setAuth,
    setLoading,
    onSuccess,
  ]);

  if (isMiniApp) return null;

  return (
    <div className={`telegram-login-widget ${className}`}>
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          <span className="ml-2 text-sm text-muted-foreground">
            {t("authenticating")}
          </span>
        </div>
      )}
      <div
        ref={containerRef}
        className={isLoading ? "opacity-50 pointer-events-none" : ""}
      />
    </div>
  );
}

