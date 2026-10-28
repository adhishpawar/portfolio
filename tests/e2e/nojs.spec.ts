import { expect, test } from "@playwright/test";

test.use({ javaScriptEnabled: false });

test("with JavaScript disabled the h1 and all eight chapter headings are visible", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toBeVisible();
  const headings = page.locator("main section > div > h1, main section > div > h2");
  await expect(headings).toHaveCount(8);
  for (let i = 0; i < 8; i++) await expect(headings.nth(i)).toBeVisible();
});

test("with JavaScript disabled the nav links and the connect button are present", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator('nav[aria-label="Primary"] a')).toHaveCount(4);
  await expect(page.locator("#ch-07").getByRole("link", { name: "Let's connect" })).toBeVisible();
  await expect(page.locator("#ch-04")).toContainText("First pilot: Royal Orchid Hotels, Bangalore.");
  await expect(page.locator("[data-boot]")).toHaveCount(0);
  await expect(page.locator("#ch-04 [data-node]")).toHaveCount(4);
});
