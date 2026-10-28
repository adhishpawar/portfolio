import type { Page } from "@playwright/test";

// Opens the page, waits for hydration, then dismisses the boot overlay the way a
// keyboard user would (any key), so later checks see the settled page.
export async function openSettled(page: Page, path = "/"): Promise<void> {
  await page.goto(path, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.keyboard.press("Shift");
  await page.waitForFunction(() => !document.querySelector("[data-boot]"));
}
