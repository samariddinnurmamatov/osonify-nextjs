"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, Key, AlertTriangle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useAuthStore } from "../model";
import { AuthService } from "../api/auth-service";
import { isDebugMode } from "../lib";
import { env } from "@/shared/config/env";

interface DebugLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DebugLoginModal({ isOpen, onClose, onSuccess }: DebugLoginModalProps) {
  const t = useTranslations("auth.debug");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [skipValidation, setSkipValidation] = useState(false);
  const { setAuth, setLoading } = useAuthStore();

  const handleLogin = async () => {
    if (!token.trim()) {
      setError(t("enter_token"));
      return;
    }

    setIsLoading(true);
    setError("");
    setLoading(true);

    try {
      const { response, user } = await AuthService.loginWithToken(
        token.trim(),
        skipValidation
      );
      setAuth(response, user);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Debug login error:", error);
      if (error instanceof Error) {
        setError(error.message || t("auth_failed_check_token"));
      } else {
        setError(t("auth_failed_check_token"));
      }
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleLogin();
    }
  };

  if (!isOpen || !isDebugMode()) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-md w-full p-6 border">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{t("title")}</h2>
              <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Warning */}
        <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                {t("active")}
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">
                {t("description")}
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 font-mono bg-orange-100 dark:bg-orange-900/20 px-2 py-1 rounded">
                API: {env.NEXT_PUBLIC_API_BASE_URL}
              </p>
            </div>
          </div>
        </div>

        {/* Token Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{t("token_label")}</label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t("token_placeholder")}
              className="pl-10"
              disabled={isLoading}
            />
          </div>

          {/* Skip validation option */}
          <div className="mt-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={skipValidation}
                onChange={(e) => setSkipValidation(e.target.checked)}
                className="mr-2 h-4 w-4"
                disabled={isLoading}
              />
              <span className="text-sm text-muted-foreground">{t("skip_validation")}</span>
            </label>
          </div>

          {error && (
            <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
              {!skipValidation && (
                <p className="text-xs text-destructive/80 mt-1">
                  {t("try_skip_validation")}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleLogin}
            disabled={isLoading || !token.trim()}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                {t("authenticating")}
              </>
            ) : (
              t("login")
            )}
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">{t("footer")}</p>
        </div>
      </div>
    </div>
  );
}

