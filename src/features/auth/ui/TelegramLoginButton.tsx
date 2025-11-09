"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/ui/button";
import { env } from "@/shared/config/env";
import { DebugLoginModal } from "./DebugLoginModal";
import type { TelegramLoginData } from "@/shared/api/types/auth.types";
import { toast } from "@/shared/stores/toastStore";

// Telegram WebApp types
interface TelegramWebApp {
  initData?: string;
}

interface TelegramGlobal {
  WebApp?: TelegramWebApp;
}

interface TelegramLoginWidget {
  dataOnauth: (user: TelegramLoginData) => Promise<void>;
}

declare global {
  interface Window {
    Telegram?: TelegramGlobal;
    TelegramLoginWidget?: TelegramLoginWidget;
  }
}

/**
 * TelegramLoginButton
 * 
 * In production: Loads Telegram Login Widget with data-onauth callback
 * In development: Shows Debug Login button
 * Supports both Mini App and Browser widget login
 */
export function TelegramLoginButton() {
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const isDevelopment = env.NEXT_PUBLIC_APP_ENV === "development";
  const isMiniApp = typeof window !== "undefined" && !!window.Telegram?.WebApp?.initData;

  // Handle Mini App auto-login
  useEffect(() => {
    if (!isMiniApp || isDevelopment) return;

    const handleMiniAppLogin = async () => {
      setIsLoading(true);
      try {
        const initData = window.Telegram?.WebApp?.initData;
        if (!initData) {
          throw new Error("No init data available");
        }
        const apiUrl = env.readPublic("NEXT_PUBLIC_API_BASE_URL") || "https://api.osonify.ai";
        
        // Login with WebApp
        const authResponse = await fetch(
          `${apiUrl}/api/v1/auth/webapp?init_data=${encodeURIComponent(initData)}`,
          { method: "POST", headers: { "Content-Type": "application/json" } }
        );
        
        if (!authResponse.ok) throw new Error("Login failed");
        const authData = await authResponse.json();
        
        // Get user profile
        const profileResponse = await fetch(`${apiUrl}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${authData.token.access_token}` },
        });
        
        if (!profileResponse.ok) throw new Error("Failed to fetch profile");
        const profile = await profileResponse.json();
        
        // Set cookies via API route
        const callbackResponse = await fetch("/api/auth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "webapp",
            tokens: authData.token,
            user: profile,
          }),
        });

        if (!callbackResponse.ok) throw new Error("Failed to set cookies");
        const result = await callbackResponse.json();

        toast.success("Login successful", "Welcome!");
        
        // Get locale and redirect
        const currentPath = window.location.pathname;
        const localeMatch = currentPath.match(/\/(en|ru|uz)\//);
        const locale = localeMatch ? localeMatch[1] : "en";
        window.location.href = result.redirect || `/${locale}/`;
      } catch (error) {
        console.error("MiniApp login failed:", error);
        toast.error("Login failed", "Please try again");
      } finally {
        setIsLoading(false);
      }
    };

    handleMiniAppLogin();
  }, [isMiniApp, isDevelopment]);

  useEffect(() => {
    // Only load widget in production and not Mini App
    if (isDevelopment || scriptLoadedRef.current || isMiniApp) return;

    const botName = env.readPublic("NEXT_PUBLIC_TELEGRAM_BOT");
    if (!botName) {
      console.warn("NEXT_PUBLIC_TELEGRAM_BOT is not set");
      return;
    }

    // Set up callback handler (like React app)
    window.TelegramLoginWidget = {
      dataOnauth: async (user: TelegramLoginData) => {
        setIsLoading(true);
        try {
          const apiUrl = env.readPublic("NEXT_PUBLIC_API_BASE_URL") || "https://api.osonify.ai";
          
          // Call backend to authenticate
          const authResponse = await fetch(`${apiUrl}/api/v1/auth/telegram`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
          });
          
          if (!authResponse.ok) throw new Error("Login failed");
          const authData = await authResponse.json();
          
          // Get user profile
          const profileResponse = await fetch(`${apiUrl}/api/v1/users/me`, {
            headers: { Authorization: `Bearer ${authData.token.access_token}` },
          });
          
          if (!profileResponse.ok) throw new Error("Failed to fetch profile");
          const profile = await profileResponse.json();

          // Set cookies via API route
          const callbackResponse = await fetch("/api/auth/callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "telegram",
              tokens: authData.token,
              user: profile,
            }),
          });

          if (!callbackResponse.ok) throw new Error("Failed to set cookies");
          const result = await callbackResponse.json();

          toast.success("Login successful", "Welcome!");
          
          // Get locale and redirect
          const currentPath = window.location.pathname;
          const localeMatch = currentPath.match(/\/(en|ru|uz)\//);
          const locale = localeMatch ? localeMatch[1] : "en";
          window.location.href = result.redirect || `/${locale}/`;
        } catch (error) {
          console.error("Login failed:", error);
          toast.error("Login failed", "Please try again");
        } finally {
          setIsLoading(false);
        }
      },
    };

    // Load Telegram widget script with data-onauth (like React app)
    if (widgetRef.current && !widgetRef.current.querySelector("script")) {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.async = true;
      script.setAttribute("data-telegram-login", botName);
      script.setAttribute("data-size", "large");
      script.setAttribute("data-corner-radius", "8");
      script.setAttribute("data-request-access", "write");
      script.setAttribute("data-userpic", "true");
      script.setAttribute("data-onauth", "TelegramLoginWidget.dataOnauth(user)");
      
      widgetRef.current.appendChild(script);
      scriptLoadedRef.current = true;
    }

    return () => {
      // Cleanup
      const currentWidget = widgetRef.current;
      delete window.TelegramLoginWidget;
      if (currentWidget) {
        currentWidget.innerHTML = "";
      }
    };
  }, [isDevelopment, isMiniApp]);

  // Mini App: auto-login, no widget needed
  if (isMiniApp && !isDevelopment) {
    return (
      <div className="flex items-center justify-center p-4">
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2" />
            <span className="text-sm text-muted-foreground">Authenticating...</span>
          </>
        ) : null}
      </div>
    );
  }

  // Development mode: show debug button
  if (isDevelopment) {
    return (
      <>
        <Button
          onClick={() => setShowDebugModal(true)}
          variant="default"
          className="bg-[#FE4838] hover:bg-[#e84133] text-white font-medium rounded-md px-6"
        >
          Debug Login
        </Button>
        <DebugLoginModal
          open={showDebugModal}
          onOpenChange={setShowDebugModal}
        />
      </>
    );
  }

  // Production mode: show Telegram widget
  return (
    <div className="telegram-login-widget">
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2" />
          <span className="text-sm text-muted-foreground">Authenticating...</span>
        </div>
      )}
      <div
        ref={widgetRef}
        className={isLoading ? "opacity-50 pointer-events-none" : ""}
      />
    </div>
  );
}

