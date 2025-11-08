"use client";

import React, { createContext, useContext, useMemo } from "react";
import { DialogContextValue, DialogKey, useDialogState } from "../model";


const DialogContext = createContext<DialogContextValue | null>(null);

interface DialogProviderProps<T extends DialogKey = DialogKey> {
  children: React.ReactNode;
  initial?: T | null;
}

export function DialogProvider<T extends DialogKey = DialogKey>({
  children,
  initial = null,
}: DialogProviderProps<T>) {
  const state = useDialogState<T>(initial);

  const value = useMemo(
    () => ({ ...state }) as DialogContextValue,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.current, state.isOpen, state.open, state.close, state.toggle]
  );

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

export function useDialogContext(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialogContext must be used within DialogProvider");
  return ctx;
}



