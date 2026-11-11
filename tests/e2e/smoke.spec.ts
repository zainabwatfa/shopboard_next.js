// First E2E test: proves Playwright starts the dev server (webServer in
// playwright.config.ts) and the shop actually renders in a real browser.
import { expect, test } from "@playwright/test";

test("the shop page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/ShopBoard/);
  await expect(
    page.getByRole("heading", { name: /Carry what matters/ }),
  ).toBeVisible();
  // The product grid arrives from the server: at least one Add to cart button
  await expect(
    page.getByRole("button", { name: /Add to cart/ }).first(),
  ).toBeVisible();
});
