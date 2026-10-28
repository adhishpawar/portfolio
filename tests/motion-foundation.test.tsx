import { render, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockMatchMedia } from "./helpers/matchMedia";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { whenIdle } from "@/lib/idle";

const { lenisInstance, LenisCtor } = vi.hoisted(() => {
  const lenisInstance = { destroy: vi.fn() };
  const LenisCtor = vi.fn(function () {
    return lenisInstance;
  });
  return { lenisInstance, LenisCtor };
});
vi.mock("lenis", () => ({ default: LenisCtor }));

const engage = async () => {
  window.dispatchEvent(new Event("scroll"));
  await vi.advanceTimersByTimeAsync(0);
};

beforeEach(() => {
  vi.useFakeTimers();
  LenisCtor.mockClear();
  lenisInstance.destroy.mockClear();
});

afterEach(() => {
  vi.useRealTimers();
  // @ts-expect-error test cleanup of an optional browser API
  delete window.requestIdleCallback;
});

describe("useReducedMotion", () => {
  it("returns true when the user prefers reduced motion, and follows changes", () => {
    const media = mockMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
    media.setReduced(false);
    expect(result.current).toBe(false);
  });

  it("returns false by default", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });
});

describe("whenIdle", () => {
  it("falls back to a timer and calls back exactly once", () => {
    const cb = vi.fn();
    whenIdle(cb);
    vi.runAllTimers();
    vi.runAllTimers();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("uses requestIdleCallback when the browser has it", () => {
    const ric = vi.fn((fn: () => void) => {
      fn();
      return 7;
    });
    window.requestIdleCallback = ric as unknown as typeof window.requestIdleCallback;
    const cb = vi.fn();
    whenIdle(cb, 500);
    expect(ric).toHaveBeenCalledWith(expect.any(Function), { timeout: 500 });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("returns a cancel function that prevents the call", () => {
    const cb = vi.fn();
    const cancel = whenIdle(cb);
    cancel();
    vi.runAllTimers();
    expect(cb).not.toHaveBeenCalled();
  });
});

describe("LenisProvider", () => {
  it("never imports lenis when reduced motion is on", async () => {
    mockMatchMedia(true);
    const { LenisProvider } = await import("@/components/motion/LenisProvider");
    render(
      <LenisProvider>
        <p>content</p>
      </LenisProvider>,
    );
    await engage();
    expect(LenisCtor).not.toHaveBeenCalled();
  });

  it("starts Lenis after idle, keeps anchors working, and destroys it on unmount", async () => {
    mockMatchMedia(false);
    const { LenisProvider } = await import("@/components/motion/LenisProvider");
    const view = render(
      <LenisProvider>
        <p>content</p>
      </LenisProvider>,
    );
    expect(LenisCtor).not.toHaveBeenCalled();
    await engage();
    expect(LenisCtor).toHaveBeenCalledTimes(1);
    expect(LenisCtor).toHaveBeenCalledWith(expect.objectContaining({ anchors: true }));
    view.unmount();
    expect(lenisInstance.destroy).toHaveBeenCalledTimes(1);
  });

  it("waits for the visitor: nothing loads on first paint, and an idle visitor still gets Lenis after the fallback", async () => {
    mockMatchMedia(false);
    const { LenisProvider } = await import("@/components/motion/LenisProvider");
    render(
      <LenisProvider>
        <p>content</p>
      </LenisProvider>,
    );
    await vi.advanceTimersByTimeAsync(7000);
    expect(LenisCtor).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1500);
    expect(LenisCtor).toHaveBeenCalledTimes(1);
  });

  it("does not start Lenis if unmounted before the browser is idle", async () => {
    mockMatchMedia(false);
    const { LenisProvider } = await import("@/components/motion/LenisProvider");
    const view = render(
      <LenisProvider>
        <p>content</p>
      </LenisProvider>,
    );
    view.unmount();
    await engage();
    expect(LenisCtor).not.toHaveBeenCalled();
  });

  it("renders its children untouched", async () => {
    mockMatchMedia(true);
    const { LenisProvider } = await import("@/components/motion/LenisProvider");
    const view = render(
      <LenisProvider>
        <p>content</p>
      </LenisProvider>,
    );
    expect(view.getByText("content")).toBeInTheDocument();
  });
});
