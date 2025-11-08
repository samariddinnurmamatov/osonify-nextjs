"use client";

import { AlertTriangle } from "lucide-react";
import { isDebugMode } from "../lib";

export function DebugModeIndicator() {
  if (!isDebugMode()) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-orange-100 dark:bg-orange-900/20 border-l-4 border-orange-500 text-orange-700 dark:text-orange-300 p-3 rounded-r-lg shadow-lg animate-pulse">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">DEBUG MODE</span>
        </div>
      </div>
    </div>
  );
}

