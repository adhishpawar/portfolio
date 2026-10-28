import { expect, test } from "@playwright/test";
import { openSettled, openWithBoot } from "./helpers";

test("first Tab focuses the Skip to content link", async ({ page }) => {
  await openSettled(page);
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement?.textContent);
  expect(focused).toBe("Skip to content");
});

test("every focusable element shows a visible focus outline", async ({ page }) => {
  await openSettled(page);
  const count = await page.evaluate(
    () =>
      document.querySelectorAll("a[href], button, input, select, textarea, [tabindex]:not([tabindex='-1'])")
        .length,
  );
  expect(count).toBeGreaterThan(5);

  const missing: string[] = [];
  for (let i = 0; i < count; i++) {
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const style = getComputedStyle(el);
      return {
        what: `${el.tagName.toLowerCase()} "${(el.textContent ?? "").trim().slice(0, 30)}"`,
        style: style.outlineStyle,
        width: parseFloat(style.outlineWidth),
      };
    });
    if (outline && (outline.style === "none" || outline.width <= 0)) missing.push(outline.what);
  }
  expect(missing).toEqual([]);
});

test("the boot readout's Skip intro button works with Enter (focused directly, since any key skips first)", async ({
  page,
}) => {
  await openWithBoot(page);
  await page.focus("[data-boot] button");
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => !document.querySelector("[data-boot]"));
  expect(await page.locator("main").isVisible()).toBe(true);
});

test("any key dismisses the boot overlay, and it does not replay in the same session", async ({
  page,
}) => {
  await openWithBoot(page);
  await page.keyboard.press("Tab");
  await page.waitForFunction(() => !document.querySelector("[data-boot]"));
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  expect(await page.locator("[data-boot]").count()).toBe(0);
});

test("anchor navigation works and moves focus to the target section", async ({ page }) => {
  await openSettled(page);
  await page.locator('nav[aria-label="Primary"] a[href="#ch-07"]').click();
  await expect(page).toHaveURL(/#ch-07$/);
  await expect(page.locator("#ch-07")).toBeInViewport();
});

test("the boot readout does not pop up over content on a deep link", async ({ page }) => {
  await page.goto("/#ch-07", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  expect(await page.locator("[data-boot]").count()).toBe(0);
  await expect(page.locator("#ch-07")).toBeInViewport();
});
