import { test, expect } from "@playwright/test";

test("products page lists all five Revsys AI solutions", async ({ page }) => {
  await page.goto("/products");
  await expect(page.getByRole("heading", { name: "Revenue Scanner", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Revenue Diagnosis" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Revenue Recovery" })).toBeVisible();
  await expect(page.getByText("Adaptive Shopping")).toBeVisible();
  await expect(page.getByText("Demand Capture")).toBeVisible();
  await expect(page.getByText("Coming Soon")).toHaveCount(2);
});

test("demo page demonstrates product capabilities without requiring a store", async ({ page }) => {
  await page.goto("/demo");

  // Defaults to the Adaptive Shopping tab.
  await expect(page.getByText("Arrives From an Instagram Ad")).toBeVisible();

  await page.getByRole("tab", { name: "Demand Capture" }).click();
  await expect(page.getByRole("heading", { name: "Content" })).toBeVisible();

  await page.getByRole("tab", { name: "Revenue Recovery" }).click();
  await expect(page.getByText("Before").first()).toBeVisible();
  await expect(page.getByText("After").first()).toBeVisible();

  // The Revenue Scanner must not be demonstrated on this page per the revision brief.
  await expect(page.getByRole("button", { name: "Analyze My Store" })).toHaveCount(0);
});

test("homepage hero links to the scanner and demo", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Find My Lost Revenue" }).first()).toHaveAttribute(
    "href",
    "/revenue-scanner"
  );
  await expect(page.getByRole("link", { name: "Watch The Demo" })).toHaveAttribute("href", "/demo");
});

test("homepage desktop nav links to Products", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.getByRole("banner").getByRole("link", { name: "Products", exact: true }).click();
  await expect(page).toHaveURL(/\/products$/);
});

test("homepage inline scanner CTA navigates to the scanner with the URL prefilled", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Store URL").fill("homepage-cta-store.myshopify.com");
  await page.getByRole("button", { name: "Analyze My Store" }).click();
  await expect(page).toHaveURL(/\/revenue-scanner\?url=/);
  await expect(page.getByLabel("Store URL")).toHaveValue("homepage-cta-store.myshopify.com");
});
