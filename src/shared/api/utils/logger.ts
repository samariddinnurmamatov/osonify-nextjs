/**
 * Logger Utility
 * Centralized logging with production-aware behavior
 * Tree-shakeable and SSR-safe
 */

import { env } from "@/shared/config/env";

type LogLevel = "error" | "warn" | "info" | "debug";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private shouldLog(level: LogLevel): boolean {
    // In production, only log errors
    if (env.NEXT_PUBLIC_APP_ENV === "production") {
      return level === "error";
    }
    return true;
  }

  error(message: string, context?: LogContext): void {
    if (this.shouldLog("error")) {
      console.error(`[API Error] ${message}`, context || {});
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog("warn")) {
      console.warn(`[API Warn] ${message}`, context || {});
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog("info")) {
      console.info(`[API Info] ${message}`, context || {});
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog("debug")) {
      console.debug(`[API Debug] ${message}`, context || {});
    }
  }
}

export const logger = new Logger();

