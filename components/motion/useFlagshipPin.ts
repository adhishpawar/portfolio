"use client";

import { useEffect } from "react";
import { whenEngaged } from "@/lib/idle";
import { useReducedMotion } from "./useReducedMotion";

interface PinTimeline {
  scrollTrigger?: { kill: () => void };
  kill: () => void;
}

const DESKTOP = "(min-width: 60rem)";

// On wide screens, pins the FifthSense chapter for a moment and lights its
// pipeline nodes in order. Skipped on phones and for reduced-motion visitors,
// and GSAP is only fetched when it will actually run.
export function useFlagshipPin(getTarget: () => HTMLElement | null): void {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia(DESKTOP).matches) return;
    const target = getTarget();
    if (!target) return;

    let timeline: PinTimeline | undefined;
    let cancelled = false;

    const cancelEngaged = whenEngaged(async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({
        scrollTrigger: { trigger: target, start: "top top", end: "+=60%", pin: true, scrub: 0.6 },
      });
      tl.from(target.querySelectorAll("[data-node]"), {
        opacity: 0.2,
        stagger: 0.25,
        duration: 0.4,
      });
      timeline = tl;
    });

    return () => {
      cancelled = true;
      cancelEngaged();
      timeline?.scrollTrigger?.kill();
      timeline?.kill();
    };
  }, [reduced, getTarget]);
}
