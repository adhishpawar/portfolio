"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

// false while rendering on the server and during hydration, true afterwards.
// Lets a component add JS-only enhancements without a hydration mismatch.
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
