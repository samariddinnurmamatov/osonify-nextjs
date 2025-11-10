"use client";

import React, { useState } from "react";
import { AlertTriangle, Key } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { env } from "@/shared/config/env";
import { toast } from "@/shared/stores/toastStore";

interface DebugLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DebugLoginModal({
  open,
  onOpenChange,
  onSuccess,
}: DebugLoginModalProps) {
  const [token, setToken] = useState("");
  const [skipValidation, setSkipValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!token.trim()) {
      toast.error("Error", "Please enter a token");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/debug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token.trim(), skipValidation }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
      }

      toast.success("Success", "Logged in successfully");
      onOpenChange(false);
      setToken("");
      onSuccess?.();
    } catch (error) {
      toast.error(
        "Login Failed",
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isDevelopment = env.NEXT_PUBLIC_APP_ENV === "development";

  if (!isDevelopment) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <DialogTitle>Debug Mode</DialogTitle>
          </div>
          <DialogDescription>Development Authentication</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  Debug Mode Active
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  This is a development environment. Enter your authentication
                  token to proceed.
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                  API: {env.NEXT_PUBLIC_API_BASE_URL}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="token"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Key className="h-4 w-4" />
              Authentication Token
            </label>
            <Input
              id="token"
              type="text"
              placeholder="Enter your token here..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  handleLogin();
                }
              }}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="skipValidation"
              checked={skipValidation}
              onChange={(e) => setSkipValidation(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label
              htmlFor="skipValidation"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Skip API validation (use if API is not accessible)
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleLogin} disabled={isLoading || !token.trim()}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-2">
          Debug mode is enabled. This modal only appears in development
          environments.
        </p>
      </DialogContent>
    </Dialog>
  );
}
