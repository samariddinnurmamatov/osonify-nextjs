export function safeCall(fn: (() => void) | undefined): void {
  if (typeof fn === "function") fn();
}

export function areEqualKeys(a: unknown, b: unknown): boolean {
  return a === b;
}




