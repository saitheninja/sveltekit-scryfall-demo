import { test, expect } from "@playwright/test";

test.describe("Homepage renders", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("page has title", async ({ page }) => {
    // expect title "to contain" a substring
    await expect(page).toHaveTitle(/Home/);
    // When `expected` parameter is a string, Playwright will normalize whitespaces and line breaks both in the actual text and in the expected string before matching.
    // When regular expression is used, the actual text is matched as is.
  });

  test("page has h1", async ({ page }) => {
    // const h1 = page.getByRole("heading", { level: 1 });
    const h1 = page.getByRole("heading", { level: 1, name: "Welcome" });

    await expect(h1).toBeVisible();
    // await expect(h1).toHaveText("Welcome");
  });
});
