import { test, expect } from "@playwright/test";

test("unauthenticated access to a protected dashboard route redirects to login", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
});

test("unauthenticated access to nested dashboard routes also redirects to login", async ({
  page,
}) => {
  await page.goto("/dashboard/health");
  await expect(page).toHaveURL(/\/login$/);
});

test("login page renders the credential form", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();
});

test("signup page is reachable from the login page and back", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("link", { name: "Create an account" }).click();
  await expect(page).toHaveURL(/\/signup$/);
  await expect(page.getByRole("heading", { name: "Create your Revsys AI account" })).toBeVisible();

  await page.getByRole("link", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/login$/);
});
