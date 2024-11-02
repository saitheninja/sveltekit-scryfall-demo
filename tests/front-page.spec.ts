import { test, expect } from "@playwright/test";

test.describe("homepage renders", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page has title", async ({ page }) => {
    // expect title "to contain" a substring
    await expect(page).toHaveTitle(/Home/);

    // When `expected` parameter is a string, Playwright will normalize whitespaces and line breaks both in the actual text and in the expected string before matching.
    // When regular expression is used, the actual text is matched as is.
  });

  test("page has h1", async ({ page }) => {
    const h1 = page.getByRole("heading", { level: 1 });

    await expect(h1).toBeVisible();
    await expect(h1).toHaveText("Welcome!");
  });
});

test.describe("log in", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("scryfall page only shows log in message", async ({ page }) => {
    await page.goto("/scryfall");

    // message to log in is visible
    const heading = page.getByRole("heading", { level: 2 });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText("Not Logged In");

    // account section not visible
    const locator = page.locator("#account");
    await expect(locator).not.toBeVisible();
  });

  // test("form has h2", async ({ page }) => {
  //   const h2 = page.getByRole("heading", { level: 2, name: "Log In" });
  //
  //   await expect(h2).toBeVisible();
  //   await expect(h2).toHaveText("Log In");
  // });
  //   await page.getByRole("link", { name: "Get started" }).click();

  test("form displays error on unsuccessful login", async ({ page }) => {
    // get heading
    const headingLogIn = page.getByRole("heading", {
      name: "Log In",
      exact: true,
    });
    await expect(headingLogIn).toBeVisible();

    // get form
    const form = page.getByRole("form", { name: "Log In" });
    await expect(form).toBeVisible();

    // fill inputs and submit
    await form.getByLabel("Email").fill("thisisanemail@testemail.com");
    await form.getByLabel("Password").fill("password");
    await form.getByRole("button", { name: "Log In" }).click();

    // unsuccessful login attempt displays error message
    const errorHeading = page.getByRole("heading", { name: "Error" });
    await expect(errorHeading).toBeVisible();
    await expect(errorHeading).toHaveText("Error");
  });

  test("form successfully logs in test user", async ({ page }) => {
    // get heading
    const headingLogIn = page.getByRole("heading", {
      name: "Log In",
      exact: true,
    });
    await expect(headingLogIn).toBeVisible();

    // get form
    const form = page.getByRole("form", { name: "Log In" });
    await expect(form).toBeVisible();

    // read env variables
    const testEmail = process.env.TEST_EMAIL ?? "test@example.com";
    const testPassword = process.env.TEST_PASSWORD ?? "password123";

    // fill inputs and submit
    await form.getByLabel("Email").fill(testEmail);
    await form.getByLabel("Password").fill(testPassword);
    await form.getByRole("button", { name: "Log In" }).click();

    // redirect on success
    await page.waitForURL("**/scryfall");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText("Scryfall Data");
  });
});
