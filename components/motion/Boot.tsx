"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { BOOT_MS, hasSeenBoot, markBootSeen, shouldPlayBoot } from "@/lib/boot";
import styles from "./Boot.module.scss";
import { useHydrated } from "./useHydrated";
import { useReducedMotion } from "./useReducedMotion";

// A short boot readout in the corner. Content and LCP never wait for it, and it removes
// itself on any key press.
export function Boot({ lines }: { lines: string[] }) {
  const reduced = useReducedMotion();
  const hydrated = useHydrated();
  const [dismissed, setDismissed] = useState(false);

  const playing = hydrated && !dismissed && shouldPlayBoot({ reduced, seen: hasSeenBoot() });

  const dismiss = useCallback(() => {
    markBootSeen();
    setDismissed(true);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(dismiss, BOOT_MS);
    document.addEventListener("keydown", dismiss);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", dismiss);
    };
  }, [playing, dismiss]);

  if (!playing) return null;

  return (
    <div data-boot className={styles.hud} style={{ "--boot-ms": `${BOOT_MS}ms` } as CSSProperties}>
      <div aria-hidden="true" className={styles.lines}>
        {lines.map((line, i) => (
          <p key={i} className={styles.line} style={{ animationDelay: `${i * 0.4}s` }}>
            {line}
          </p>
        ))}
      </div>
      <button type="button" className={styles.skip} onClick={dismiss}>
        Skip intro
      </button>
    </div>
  );
}
