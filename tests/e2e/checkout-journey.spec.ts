// The real checkout journey, end to end, in a real browser. Each test gets a
// fresh browser context (empty localStorage), so the cart always starts
// empty. Elements are found the accessible way — roles, names, labels — like
// the component tests, but here nothing is mocked: the dev server renders,
// the cart really persists, the form really validates.
import { expect, test } from "@playwright/test";

test("a visitor shops, adjusts the cart, and completes the demo checkout", async ({
  page,
}) => {
  // 1. The shop: add one product; the toast and the header badge react
  await page.goto("/");
  await page
    .getByRole("button", { name: "Add to cart: Leather Tote Bag" })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "added" }),
  ).toContainText("Leather Tote Bag added to your cart (1 in cart).");
  await expect(page.locator("#cart-count")).toHaveText("1");

  // 2. The toast's "View cart" leads to the cart page with the row.
  // "Leather Tote Bag" is on screen several times here (the toast, the old
  // page while the new one streams in), so the locator is scoped to the
  // cart list — strict mode refuses ambiguous matches otherwise.
  await page.getByRole("link", { name: "View cart" }).click();
  await expect(page).toHaveURL(/\/cart$/);
  const cartList = page.getByRole("list", { name: "Your cart" });
  await expect(cartList.getByText("Leather Tote Bag")).toBeVisible();

  // 3. + raises the quantity: the row's line total and the badge follow
  // ($178.00 also shows in the summary, hence the scoped locator again)
  await page
    .getByRole("button", { name: "Increase quantity of Leather Tote Bag" })
    .click();
  await expect(cartList.getByText("$178.00")).toBeVisible();
  await expect(page.locator("#cart-count")).toHaveText("2");

  // 4. To the checkout; an empty submit shows the Zod messages and no order
  await page.getByRole("link", { name: "Proceed to checkout" }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await page.getByRole("button", { name: /Place demo order/ }).click();
  await expect(
    page.getByText("Full name must be at least 2 characters"),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Order confirmed!" }),
  ).toHaveCount(0);

  // 5. A properly filled form places the demo order
  await page.getByLabel("Full name").fill("Zainab Watfa");
  await page.getByLabel("Email address").fill("zainab@example.com");
  await page.getByLabel("Phone").fill("+90 555 000 1234");
  await page.getByLabel("Street address").fill("123 Market Street");
  await page.getByLabel("City").fill("Istanbul");
  await page.getByLabel("Postal code").fill("34000");
  await page.getByRole("button", { name: /Place demo order/ }).click();

  // 6. Confirmation: order number, the amount paid, and an emptied cart.
  // ($178.00 also lives in the screen-reader announcer, so the asserts are
  // scoped to the confirmation region)
  const confirmation = page.getByRole("region", { name: "Order confirmed!" });
  await expect(
    confirmation.getByRole("heading", { name: "Order confirmed!" }),
  ).toBeVisible();
  await expect(confirmation.getByText("SB-10482")).toBeVisible();
  await expect(confirmation.getByText("$178.00")).toBeVisible();
  await expect(page.locator("#cart-count")).toHaveText("0");
});

test("a filter deep link opens the shop already filtered", async ({ page }) => {
  await page.goto("/?q=tote");
  await expect(page.getByRole("searchbox", { name: "Search" })).toHaveValue(
    "tote",
  );
  await expect(page.getByText("Showing 1 of 13 products")).toBeVisible();
  await expect(page.getByRole("button", { name: /^Add to cart:/ })).toHaveCount(
    1,
  );
});

test("an unknown product id shows the not-found card", async ({ page }) => {
  await page.goto("/products/999");
  await expect(
    page.getByRole("heading", { name: "Product not found" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Browse products" }),
  ).toBeVisible();
});
