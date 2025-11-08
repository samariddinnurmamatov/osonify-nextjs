export type DialogKey = string | boolean;

export interface DialogState<T extends DialogKey = DialogKey> {
  current: T | null;
}

export interface DialogControls<T extends DialogKey = DialogKey> {
  open: (key: T) => void;
  close: () => void;
  toggle: (key: T) => void;
  isOpen: (key: T) => boolean;
}

export interface DialogContextValue<T extends DialogKey = DialogKey>
  extends DialogState<T>,
    DialogControls<T> {}




