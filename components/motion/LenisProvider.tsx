"use client";

import { useEffect, type ReactNode } from "react";
import { whenIdle } from "@/lib/idle";
import { useReducedMotion } from "./useReducedMotion";

// Smooth scrolling is an enhancement: it loads after first paint, never for
// reduced-motion visitors, and leaves keyboard scrolling and anchors to the browser.
export function LenisProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let lenis: { destroy: () => void } | undefined;
    let cancelled = false;

    const cancelIdle = whenIdle(async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;
      lenis = new Lenis({ anchors: true, autoRaf: true });
    });

    return () => {
      cancelled = true;
      cancelIdle();
      lenis?.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}
