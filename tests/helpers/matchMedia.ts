import { act } from "@testing-library/react";
import { vi } from "vitest";

type Listener = (event: { matches: boolean }) => void;

// Installs a controllable window.matchMedia. Only the reduced-motion query is
// meaningful; every other query reports no match.
export function mockMatchMedia(initiallyReduced: boolean) {
  let reduced = initiallyReduced;
  const listeners = new Set<Listener>();

  window.matchMedia = vi.fn((query: string) => ({
    get matches() {
      return query.includes("prefers-reduced-motion") ? reduced : false;
    },
    media: query,
    addEventListener: (_: string, l: Listener) => listeners.add(l),
    removeEventListener: (_: string, l: Listener) => listeners.delete(l),
    addListener: (l: Listener) => listeners.add(l),
    removeListener: (l: Listener) => listeners.delete(l),
    dispatchEvent: () => true,
    onchange: null,
  })) as unknown as typeof window.matchMedia;

  return {
    setReduced(value: boolean) {
      reduced = value;
      act(() => listeners.forEach((l) => l({ matches: value })));
    },
  };
}
