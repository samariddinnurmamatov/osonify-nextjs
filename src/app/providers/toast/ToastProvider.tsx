"use client";

import React from "react";
import { ToastContainer } from "@/shared/ui/toast";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}

