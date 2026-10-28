// Runs cb when the browser is idle (or soon after, where requestIdleCallback is
// missing, as in Safari). Returns a cancel function.
export function whenIdle(cb: () => void, timeoutMs = 2000): () => void {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    const id = window.requestIdleCallback(() => cb(), { timeout: timeoutMs });
    return () => window.cancelIdleCallback?.(id);
  }
  const id = setTimeout(cb, 1);
  return () => clearTimeout(id);
}
