"use client";

import useDialogState from "@/shared/hooks/use-dialog-state";

export function useProfileDropdownState() {
  const [open, setOpen] = useDialogState();
  return { open, setOpen } as const;
}


