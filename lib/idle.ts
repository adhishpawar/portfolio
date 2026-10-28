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

const ENGAGEMENT_EVENTS = ["scroll", "pointerdown", "keydown", "touchstart"] as const;

// Runs cb on the visitor's first scroll, tap, click or key press, or after
// timeoutMs if they do nothing. For enhancements that only matter once someone
// interacts (scroll-driven animation, smooth scrolling), so they never compete
// with the first paint. Returns a cancel function.
export function whenEngaged(cb: () => void, timeoutMs = 8000): () => void {
  if (typeof window === "undefined") return () => {};

  let done = false;

  const cleanup = () => {
    for (const type of ENGAGEMENT_EVENTS) window.removeEventListener(type, fire);
    clearTimeout(timer);
  };
  const fire = () => {
    if (done) return;
    done = true;
    cleanup();
    cb();
  };

  for (const type of ENGAGEMENT_EVENTS) window.addEventListener(type, fire, { passive: true });
  const timer = setTimeout(fire, timeoutMs);

  return () => {
    done = true;
    cleanup();
  };
}
