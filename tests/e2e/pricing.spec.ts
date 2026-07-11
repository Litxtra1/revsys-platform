import { test, expect } from "@playwright/test";

test("pricing page shows annual figures by default and toggles to monthly", async ({ page }) => {
  await page.goto("/pricing");

  await expect(page.getByRole("heading", { name: "Starter" })).toBeVisible();
  await expect(page.getByText("Free", { exact: true })).toBeVisible();
  await expect(page.getByText("$990", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("$2,990", { exact: false }).first()).toBeVisible();

  await page.getByLabel("Toggle annual billing").click();
  await expect(page.getByText("$99", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("$299", { exact: false }).first()).toBeVisible();
});

test("pricing page CTAs route to signup and contact", async ({ page }) => {
  await page.goto("/pricing");

  await expect(page.getByRole("link", { name: "Get Started Free" })).toHaveAttribute(
    "href",
    "/signup"
  );
  await expect(page.getByRole("link", { name: "Contact Sales" })).toHaveAttribute(
    "href",
    "/contact"
  );
});

test("pricing page FAQ accordion expands", async ({ page }) => {
  await page.goto("/pricing");
  await page.getByRole("button", { name: "Can I switch plans later?" }).click();
  await expect(page.getByText("no long-term commitment required")).toBeVisible();
});
