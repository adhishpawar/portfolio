"use client";

import { useEffect, useRef } from "react";
import { whenIdle } from "@/lib/idle";
import { computeOrbitSegments } from "@/lib/orbit";
import styles from "./OrbitLine.module.scss";
import { useReducedMotion } from "./useReducedMotion";

interface OrbitLineProps {
  chapterIds: string[];
  weights?: Record<string, number>;
}

interface DrawTimeline {
  scrollTrigger?: { kill: () => void };
  kill: () => void;
}

// One decorative line that draws itself as the page scrolls. GSAP and
// ScrollTrigger load after first paint; reduced-motion visitors get the line
// fully drawn and GSAP is never fetched.
export function OrbitLine({ chapterIds, weights }: OrbitLineProps) {
  const reduced = useReducedMotion();
  const pathRef = useRef<SVGPathElement>(null);
  const key = JSON.stringify([chapterIds, weights ?? {}]);

  useEffect(() => {
    const path = pathRef.current;
    if (reduced || !path) return;
    const [ids, shares] = JSON.parse(key) as [string[], Record<string, number>];

    let timeline: DrawTimeline | undefined;
    let cancelled = false;

    const cancelIdle = whenIdle(async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });
      for (const segment of computeOrbitSegments(ids, shares)) {
        tl.addLabel(segment.id, segment.start).to(
          path,
          { strokeDashoffset: 1 - segment.end, duration: segment.end - segment.start, ease: "none" },
          segment.start,
        );
      }
      timeline = tl;
    });

    return () => {
      cancelled = true;
      cancelIdle();
      timeline?.scrollTrigger?.kill();
      timeline?.kill();
    };
  }, [reduced, key]);

  return (
    <svg
      className={styles.orbit}
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 100 1000"
      preserveAspectRatio="none"
    >
      <path
        ref={pathRef}
        d="M 80 0 C 20 200, 120 350, 60 520 S 20 800, 70 1000"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={reduced ? 0 : 1}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
