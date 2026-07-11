import { test, expect, type Page } from "@playwright/test";

async function getHealthScore(page: Page): Promise<string> {
  const text = await page.locator("text=Revenue Health Score").locator("..").innerText();
  return text.match(/(\d+)/)?.[1] ?? "";
}

test("full scan flow: submit a store URL and land on a populated Revenue Report", async ({
  page,
}) => {
  await page.goto("/revenue-scanner");
  await page.getByLabel("Store URL").fill("playwright-test-store.myshopify.com");
  await page.getByRole("button", { name: "Analyze My Store" }).click();

  await expect(page.getByText("Connecting to Store")).toBeVisible();

  await page.waitForURL(/\/revenue-report\?url=/, { timeout: 15000 });

  await expect(page.getByText("playwright-test-store.myshopify.com")).toBeVisible();
  await expect(page.getByText("Revenue Health Score")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Top Revenue Leaks" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Connect My Store" })).toBeVisible();
});

test("the same store URL produces a consistent report across visits", async ({ page }) => {
  await page.goto("/revenue-report?url=consistent-store.myshopify.com");
  const first = await getHealthScore(page);

  await page.goto("/revenue-report?url=consistent-store.myshopify.com");
  const second = await getHealthScore(page);

  expect(first).not.toBe("");
  expect(first).toBe(second);
});

test("invalid store URL shows a failure state instead of navigating away", async ({ page }) => {
  await page.goto("/revenue-scanner");
  await page.getByLabel("Store URL").fill("not a valid url");
  await page.getByRole("button", { name: "Analyze My Store" }).click();
  await expect(page.getByText("Scan Failed")).toBeVisible({ timeout: 15000 });
  await expect(page).toHaveURL(/\/revenue-scanner/);
});
