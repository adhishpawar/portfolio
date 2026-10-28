import { describe, expect, it } from "vitest";
import { contrastRatio } from "@/lib/contrast";

describe("contrastRatio", () => {
  it("is 21 for black on white", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 1);
  });
});

describe("palette contrast (WCAG AA, 4.5:1 for body text)", () => {
  it.each([
    ["signal on void", "#F4F4F4", "#0D0D0D"],
    ["dim on void", "#9F9F9F", "#0D0D0D"],
    ["faint on void", "#828282", "#0D0D0D"],
    ["accent-text on void", "#7C97FF", "#0D0D0D"],
    ["white on accent (button)", "#FFFFFF", "#2F5BFF"],
  ])("%s passes", (_label, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it("documents why --accent is never used for small text", () => {
    expect(contrastRatio("#2F5BFF", "#0D0D0D")).toBeLessThan(4.5);
  });
});
