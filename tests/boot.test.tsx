import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockMatchMedia } from "./helpers/matchMedia";
import { Boot } from "@/components/motion/Boot";
import {
  BOOT_MAX_HYDRATION_MS,
  BOOT_MS,
  BOOT_STORAGE_KEY,
  bootLines,
  isPristineLoad,
  shouldPlayBoot,
} from "@/lib/boot";
import { loadContent } from "@/lib/content";

const LINES = ["> initialising orbit", "> chapter 00 loaded"];

beforeEach(() => {
  vi.useFakeTimers();
  window.sessionStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("shouldPlayBoot", () => {
  it.each([
    [{ reduced: false, seen: false, pristine: true }, true],
    [{ reduced: true, seen: false, pristine: true }, false],
    [{ reduced: false, seen: true, pristine: true }, false],
    [{ reduced: false, seen: false, pristine: false }, false],
    [{ reduced: true, seen: true, pristine: false }, false],
  ])("%j -> %s", (input, expected) => {
    expect(shouldPlayBoot(input)).toBe(expected);
  });

  it("keeps the whole sequence at or under three seconds", () => {
    expect(BOOT_MS).toBeLessThanOrEqual(3000);
  });
});

describe("isPristineLoad", () => {
  afterEach(() => {
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
    window.location.hash = "";
  });

  it("is true at the top of the page, with no anchor, early in the load", () => {
    expect(isPristineLoad()).toBe(true);
  });

  it("is false once the visitor has scrolled", () => {
    Object.defineProperty(window, "scrollY", { value: 400, configurable: true });
    expect(isPristineLoad()).toBe(false);
  });

  it("is false when the visitor arrived on a deep link", () => {
    window.location.hash = "#ch-07";
    expect(isPristineLoad()).toBe(false);
  });

  it("is false when hydration landed late, as on a slow phone connection", () => {
    vi.advanceTimersByTime(BOOT_MAX_HYDRATION_MS + 1);
    expect(isPristineLoad()).toBe(false);
  });
});

describe("bootLines", () => {
  it("is built from profile data, not hard-coded names", () => {
    const { profile, chapters } = loadContent();
    const lines = bootLines(profile, chapters[0]);
    expect(lines.join("\n")).toContain(profile.name);
    expect(lines.join("\n")).toContain(profile.location);
  });
});

describe("Boot overlay", () => {
  it("renders nothing under reduced motion", () => {
    mockMatchMedia(true);
    const { container } = render(<Boot lines={LINES} />);
    act(() => void vi.advanceTimersByTime(10));
    expect(container.querySelector("[data-boot]")).toBeNull();
  });

  it("plays for a first-time visitor and removes itself after BOOT_MS, marking the session", () => {
    mockMatchMedia(false);
    const { container } = render(<Boot lines={LINES} />);
    expect(container.querySelector("[data-boot]")).not.toBeNull();
    act(() => void vi.advanceTimersByTime(BOOT_MS + 50));
    expect(container.querySelector("[data-boot]")).toBeNull();
    expect(window.sessionStorage.getItem(BOOT_STORAGE_KEY)).toBe("1");
  });

  it("any keydown removes the overlay and marks the session", () => {
    mockMatchMedia(false);
    const { container } = render(<Boot lines={LINES} />);
    fireEvent.keyDown(document, { key: "Tab" });
    expect(container.querySelector("[data-boot]")).toBeNull();
    expect(window.sessionStorage.getItem(BOOT_STORAGE_KEY)).toBe("1");
  });

  it("the Skip intro button removes the overlay", () => {
    mockMatchMedia(false);
    const { container, getByRole } = render(<Boot lines={LINES} />);
    fireEvent.click(getByRole("button", { name: "Skip intro" }));
    expect(container.querySelector("[data-boot]")).toBeNull();
  });

  it("does not pop up over content the visitor is already reading (late hydration, scrolled, or deep link)", () => {
    mockMatchMedia(false);
    vi.advanceTimersByTime(BOOT_MAX_HYDRATION_MS + 1);
    const late = render(<Boot lines={LINES} />);
    expect(late.container.querySelector("[data-boot]")).toBeNull();
    late.unmount();
  });

  it("does not play again in the same session", () => {
    mockMatchMedia(false);
    window.sessionStorage.setItem(BOOT_STORAGE_KEY, "1");
    const { container } = render(<Boot lines={LINES} />);
    expect(container.querySelector("[data-boot]")).toBeNull();
  });

  it("hides only the decorative lines from assistive tech; Skip intro is the only focusable element", () => {
    mockMatchMedia(false);
    const { container } = render(<Boot lines={LINES} />);
    const overlay = container.querySelector("[data-boot]")!;
    expect(overlay.querySelector("[aria-hidden='true']")?.textContent).toContain("initialising orbit");
    const focusables = overlay.querySelectorAll("a, button, input, select, textarea, [tabindex]");
    expect(focusables).toHaveLength(1);
    expect(focusables[0].textContent).toBe("Skip intro");
    expect(focusables[0].closest("[aria-hidden='true']")).toBeNull();
  });

  it("never hides or blocks the main content", () => {
    mockMatchMedia(false);
    render(
      <>
        <main>page content</main>
        <Boot lines={LINES} />
      </>,
    );
    const main = document.querySelector("main")!;
    expect(main).not.toHaveAttribute("aria-hidden");
    expect(main).not.toHaveAttribute("inert");
    expect(document.querySelector("[data-boot]")!.contains(main)).toBe(false);
  });

  it("still plays, without crashing, when session storage is unavailable", () => {
    mockMatchMedia(false);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const { container } = render(<Boot lines={LINES} />);
    expect(container.querySelector("[data-boot]")).not.toBeNull();
    expect(() => fireEvent.keyDown(document, { key: "Enter" })).not.toThrow();
    expect(container.querySelector("[data-boot]")).toBeNull();
  });
});
