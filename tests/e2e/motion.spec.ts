import { expect, test } from "@playwright/test";
import { openSettled } from "./helpers";

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });

  test("has no canvas and no boot overlay, and the orbit line is fully drawn", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(4000);
    expect(await page.locator("canvas").count()).toBe(0);
    expect(await page.locator("[data-boot]").count()).toBe(0);
    const offset = await page.locator("svg path[stroke-dasharray]").first().getAttribute("stroke-dashoffset");
    expect(offset).toBe("0");
    await expect(page.locator("img[src*='halftone-orb']")).toBeVisible();
  });
});

test.describe("normal motion on desktop", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("draws the orbit line as the page scrolls", async ({ page }) => {
    await openSettled(page);
    await page.waitForTimeout(3000); // GSAP loads after idle
    const read = () =>
      page.evaluate(() => {
        const path = document.querySelector("svg path[stroke-dasharray]") as SVGPathElement;
        return parseFloat(getComputedStyle(path).strokeDashoffset);
      });
    const atTop = await read();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
    await page.waitForTimeout(2000);
    const middle = await read();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(2000);
    const bottom = await read();
    expect(atTop).toBeGreaterThan(900);
    expect(middle).toBeLessThan(atTop);
    expect(bottom).toBeLessThan(middle);
    expect(middle).toBeGreaterThan(100);
    expect(middle).toBeLessThan(900);
    expect(bottom).toBeLessThan(100);
  });

  test("mounts the live WebGL orb over the static image", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await openSettled(page);
    await page.waitForSelector("canvas[data-ready]", { timeout: 15_000 });
    expect(await page.locator("canvas[data-ready]").count()).toBeGreaterThanOrEqual(1);
    expect(errors).toEqual([]);
  });

  test("pins the FifthSense chapter while scrolling through it", async ({ page }) => {
    await openSettled(page);
    await page.waitForTimeout(3000);
    await page.locator("#ch-04").scrollIntoViewIfNeeded();
    await page.evaluate(() => {
      const top = document.getElementById("ch-04")!.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + 50);
    });
    await page.waitForTimeout(1500);
    const y1 = await page.evaluate(() => document.getElementById("ch-04")!.getBoundingClientRect().top);
    await page.evaluate(() => window.scrollBy(0, 150));
    await page.waitForTimeout(1500);
    const y2 = await page.evaluate(() => document.getElementById("ch-04")!.getBoundingClientRect().top);
    // pinned: the section stays put (within a few px) while the page scrolls under it
    expect(Math.abs(y2 - y1)).toBeLessThan(5);
  });
});

test.describe("phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("keeps the static orb and mounts no canvas", async ({ page }) => {
    await openSettled(page);
    await page.waitForTimeout(3500);
    expect(await page.locator("canvas").count()).toBe(0);
    await expect(page.locator("img[src*='halftone-orb']")).toBeVisible();
  });

  test("collapses the nav behind a Menu toggle that opens and closes", async ({ page }) => {
    await openSettled(page);
    const toggle = page.getByRole("button", { name: "Menu" });
    await expect(toggle).toBeVisible();
    await expect(page.locator('nav[aria-label="Primary"] a').first()).toBeHidden();
    await toggle.click();
    await expect(page.locator('nav[aria-label="Primary"] a').first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator('nav[aria-label="Primary"] a').first()).toBeHidden();
    await expect(toggle).toBeFocused();
  });
});
