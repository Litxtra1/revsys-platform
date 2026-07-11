import { test, expect } from "@playwright/test";

test("home page renders the hero and primary navigation", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Your Shopify Store Is Probably Losing Revenue Right Now",
      level: 1,
    })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Find My Lost Revenue" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Watch The Demo" })).toBeVisible();
});

test("desktop nav shows public links; mobile shows a hamburger menu instead", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await expect(page.getByRole("banner").getByRole("link", { name: "Products" })).toBeVisible();

  await page.setViewportSize({ width: 375, height: 800 });
  await page.reload();
  await expect(page.getByRole("banner").getByRole("link", { name: "Products" })).toBeHidden();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
});
