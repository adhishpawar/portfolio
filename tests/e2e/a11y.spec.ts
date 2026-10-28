import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { BOOT_MS } from "../../lib/boot";
import { openSettled, openWithBoot } from "./helpers";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

async function violations(page: import("@playwright/test").Page) {
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  return results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`);
}

test("no axe violations on the settled page", async ({ page }) => {
  await openSettled(page);
  expect(await violations(page)).toEqual([]);
});

test("no axe violations in the boot readout itself", async ({ page }) => {
  // Keep the readout on screen until axe is done: ignore only its own auto-dismiss timer.
  await page.addInitScript((bootMs) => {
    const original = window.setTimeout.bind(window);
    window.setTimeout = ((fn: TimerHandler, ms?: number, ...args: unknown[]) =>
      ms === bootMs ? 0 : original(fn, ms, ...args)) as typeof window.setTimeout;
  }, BOOT_MS);
  await openWithBoot(page);
  // Axe measures contrast mid-fade, so freeze the fade-in, then check only the
  // readout (a small subtree, quick enough to finish before its 2.6 s timer).
  await page.addStyleTag({
    content: "[data-boot], [data-boot] * { animation: none !important; opacity: 1 !important; }",
  });
  const results = await new AxeBuilder({ page }).include("[data-boot]").withTags(TAGS).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});

test("no axe violations with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openSettled(page);
  expect(await violations(page)).toEqual([]);
});

test("no axe violations on a phone-width viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openSettled(page);
  expect(await violations(page)).toEqual([]);
});

test("no horizontal scroll on a phone-width viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openSettled(page);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
