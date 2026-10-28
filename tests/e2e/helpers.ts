import type { Page } from "@playwright/test";

// Opens the page, waits for hydration, then dismisses the boot overlay the way a
// keyboard user would (any key), so later checks see the settled page.
export async function openSettled(page: Page, path = "/"): Promise<void> {
  await page.goto(path, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.keyboard.press("Shift");
  await page.waitForFunction(() => !document.querySelector("[data-boot]"));
}

// Opens the page with the boot readout showing. The readout is skipped on a slow
// first load (by design), so warm the browser cache, clear the session, and
// reload: the second load hydrates quickly and counts as a fresh visit.
export async function openWithBoot(page: Page, path = "/"): Promise<void> {
  await page.goto(path, { waitUntil: "networkidle" });
  await page.evaluate(() => window.sessionStorage.clear());
  await page.reload({ waitUntil: "commit" });
  await page.waitForSelector("[data-boot]");
}
