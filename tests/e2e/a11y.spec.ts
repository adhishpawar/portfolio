import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { openSettled } from "./helpers";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

async function violations(page: import("@playwright/test").Page) {
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  return results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`);
}

test("no axe violations on the settled page", async ({ page }) => {
  await openSettled(page);
  expect(await violations(page)).toEqual([]);
});

test("no axe violations while the boot overlay is showing", async ({ page }) => {
  await page.goto("/", { waitUntil: "commit" });
  await page.waitForSelector("[data-boot]");
  expect(await violations(page)).toEqual([]);
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
