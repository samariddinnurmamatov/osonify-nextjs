"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, RefreshCw, Eye, EyeOff, Info } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { env } from "@/shared/config/env";
import { getCookie } from "@/shared/lib/cookies";

export function TokenDebugPanel() {
  const [isVisible, setIsVisible] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState(false);

  // Only check environment and cookies on client-side after mount
  useEffect(() => {
    setIsMounted(true);
    setIsDevelopment(env.NEXT_PUBLIC_APP_ENV === "development");
    const cookieUserId = getCookie("auth_user_id");
    setUserId(cookieUserId || null);
    setHasToken(!!cookieUserId);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      // Token yangilandi, lekin saytni reload qilish kerak emas
      // Yangi tokenlar avtomatik ravishda barcha API requestlarda ishlatiladi
      window.location.reload();
    } catch (error) {
      console.error("Token refresh error:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Don't render anything until mounted to avoid hydration mismatch
  if (!isMounted) {
    return null;
  }

  if (!isDevelopment || !isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 p-2 rounded-lg bg-gray-900 text-white shadow-lg hover:bg-gray-800 transition-colors"
        aria-label="Show debug panel"
      >
        <Eye className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-gray-900 text-white rounded-lg shadow-xl border border-gray-700">
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <h3 className="text-sm font-semibold">Token Debug Panel</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 rounded hover:bg-gray-800 transition-colors"
          aria-label="Hide panel"
        >
          <EyeOff className="h-4 w-4" />
        </button>
      </div>

      <div className="p-3 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Status:</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            <span className="text-xs text-green-400 font-medium">Ready</span>
          </div>
        </div>

        {userId && (
          <div className="text-xs text-gray-400">
            User ID: <span className="text-gray-300">{userId}</span>
          </div>
        )}

        <Button
          onClick={handleRefresh}
          disabled={isRefreshing || !hasToken}
          className="w-full bg-green-600 hover:bg-green-700 text-white text-xs h-8"
        >
          <RefreshCw
            className={`h-3 w-3 mr-1.5 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Manual Refresh
        </Button>

        <div className="rounded bg-blue-900/50 border border-blue-700 p-2.5">
          <div className="flex items-start gap-2">
            <Info className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-200 leading-relaxed">
              Info: Token yangilanganda saytni reload qilish kerak emas! Yangi
              tokenlar avtomatik ravishda barcha API requestlarda ishlatiladi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

