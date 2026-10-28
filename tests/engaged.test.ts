import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { whenEngaged } from "@/lib/idle";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("whenEngaged", () => {
  it.each(["scroll", "pointerdown", "keydown", "touchstart"])(
    "calls back once on the first %s",
    (type) => {
      const cb = vi.fn();
      whenEngaged(cb);
      window.dispatchEvent(new Event(type));
      window.dispatchEvent(new Event(type));
      vi.runAllTimers();
      expect(cb).toHaveBeenCalledTimes(1);
    },
  );

  it("does not call back before any interaction", () => {
    const cb = vi.fn();
    whenEngaged(cb);
    vi.advanceTimersByTime(7999);
    expect(cb).not.toHaveBeenCalled();
  });

  it("falls back to a timeout so an idle visitor still gets the enhancements", () => {
    const cb = vi.fn();
    whenEngaged(cb);
    vi.advanceTimersByTime(8000);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("honours a custom timeout", () => {
    const cb = vi.fn();
    whenEngaged(cb, 1000);
    vi.advanceTimersByTime(1000);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("does not fire twice when an event arrives and then the timeout elapses", () => {
    const cb = vi.fn();
    whenEngaged(cb);
    window.dispatchEvent(new Event("scroll"));
    vi.advanceTimersByTime(20_000);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("returns a cancel function that prevents the call and removes the listeners", () => {
    const cb = vi.fn();
    const cancel = whenEngaged(cb);
    cancel();
    window.dispatchEvent(new Event("scroll"));
    vi.advanceTimersByTime(20_000);
    expect(cb).not.toHaveBeenCalled();
  });
});
