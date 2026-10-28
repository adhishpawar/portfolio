import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1440, height: 900 } });

test("the largest contentful paint element is not a canvas", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" });
  const tag = await page.evaluate(
    () =>
      new Promise<string>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1] as PerformanceEntry & { element?: Element };
          resolve(last.element?.tagName ?? "UNKNOWN");
        });
        observer.observe({ type: "largest-contentful-paint", buffered: true });
        setTimeout(() => resolve("TIMEOUT"), 6000);
      }),
  );
  expect(["CANVAS", "TIMEOUT", "UNKNOWN"]).not.toContain(tag);
});
