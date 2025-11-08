"use client";

import * as React from "react";
import { X, CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import { useToastStore, type Toast } from "../stores/toastStore";
import { cn } from "../lib/utils";

interface ToastItemProps {
  toast: Toast;
}

function ToastItem({ toast }: ToastItemProps) {
  const { removeToast } = useToastStore();
  const [isExiting, setIsExiting] = React.useState(false);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 200);
  };

  const getIcon = () => {
    const iconClass = "w-5 h-5 shrink-0";
    switch (toast.type) {
      case "success":
        return <CheckCircle2 className={cn(iconClass, "text-green-600 dark:text-green-400")} />;
      case "error":
        return <XCircle className={cn(iconClass, "text-red-600 dark:text-red-400")} />;
      case "warning":
        return <AlertTriangle className={cn(iconClass, "text-yellow-600 dark:text-yellow-400")} />;
      case "info":
        return <Info className={cn(iconClass, "text-blue-600 dark:text-blue-400")} />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200";
      case "error":
        return "bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200";
      case "info":
        return "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200";
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border shadow-lg transition-all duration-300",
        getStyles(),
        isExiting && "opacity-0 translate-x-full"
      )}
      role="alert"
      aria-live="polite"
    >
      {getIcon()}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm">{toast.title}</h4>
        {toast.message && (
          <p className="text-sm mt-1 opacity-90">{toast.message}</p>
        )}
      </div>
      <button
        onClick={handleRemove}
        className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors shrink-0"
        aria-label="Close toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[9999] space-y-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
}

