import { expect, test } from "@playwright/test";

// Cumulative layout shift, measured the way a visitor experiences it: from the
// first byte, through hydration and idle-loaded enhancements.
async function measureCls(page: import("@playwright/test").Page): Promise<number> {
  await page.addInitScript(() => {
    (window as unknown as { __cls: number }).__cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
        if (!entry.hadRecentInput) (window as unknown as { __cls: number }).__cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto("/", { waitUntil: "load" });
  await page.waitForTimeout(5000); // hydration, idle callbacks, WebGL mount, boot readout
  return page.evaluate(() => (window as unknown as { __cls: number }).__cls);
}

test("phone: the page does not shift while hydrating (CLS under 0.02)", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await measureCls(page)).toBeLessThan(0.02);
});

test("desktop: the page does not shift while hydrating (CLS under 0.02)", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  expect(await measureCls(page)).toBeLessThan(0.02);
});
