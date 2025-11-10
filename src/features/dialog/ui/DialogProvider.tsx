"use client";

import React, { createContext, useContext, useMemo } from "react";
import { DialogContextValue, DialogKey, useDialogState } from "../model";


const DialogContext = createContext<DialogContextValue<DialogKey> | null>(null);

interface DialogProviderProps<T extends DialogKey = DialogKey> {
  children: React.ReactNode;
  initial?: T | null;
}

export function DialogProvider<T extends DialogKey = DialogKey>({
  children,
  initial = null,
}: DialogProviderProps<T>) {
  const state = useDialogState<T>(initial);

  const value = useMemo<DialogContextValue<T>>(
    () => ({ ...state }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.current, state.open, state.close, state.toggle, state.isOpen]
  );

  return <DialogContext.Provider value={value as unknown as DialogContextValue<DialogKey>}>{children}</DialogContext.Provider>;
}

export function useDialogContext(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialogContext must be used within DialogProvider");
  return ctx;
}



