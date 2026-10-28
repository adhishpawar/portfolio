import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockMatchMedia } from "./helpers/matchMedia";
import { Boot } from "@/components/motion/Boot";
import { BOOT_MS, BOOT_STORAGE_KEY, bootLines, shouldPlayBoot } from "@/lib/boot";
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
    [{ reduced: false, seen: false }, true],
    [{ reduced: true, seen: false }, false],
    [{ reduced: false, seen: true }, false],
    [{ reduced: true, seen: true }, false],
  ])("%j -> %s", (input, expected) => {
    expect(shouldPlayBoot(input)).toBe(expected);
  });

  it("keeps the whole sequence at or under three seconds", () => {
    expect(BOOT_MS).toBeLessThanOrEqual(3000);
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
