import { test, expect } from "@playwright/test";

test("calculator recalculates outputs in real time as inputs change", async ({ page }) => {
  await page.goto("/calculator");

  const currentRevenue = page.locator("text=Current Monthly Revenue").locator("..");
  const initialText = await currentRevenue.innerText();

  await page.getByLabel("Monthly Visitors").fill("50000");
  await page.getByLabel("Conversion Rate (%)").fill("3");
  await page.getByLabel("Average Order Value ($)").fill("100");

  await expect(async () => {
    const updatedText = await currentRevenue.innerText();
    expect(updatedText).not.toBe(initialText);
  }).toPass();

  // 50000 visitors * 3% conversion * $100 AOV = $150,000
  await expect(currentRevenue).toContainText("$150,000");
});

test("calculator shows the benchmark-based disclaimer", async ({ page }) => {
  await page.goto("/calculator");
  await expect(page.getByText(/benchmark-based estimates/i)).toBeVisible();
});

test("potential revenue recovery never exceeds estimated leakage", async ({ page }) => {
  await page.goto("/calculator");
  await page.getByLabel("Monthly Visitors").fill("20000");
  await page.getByLabel("Conversion Rate (%)").fill("2");
  await page.getByLabel("Average Order Value ($)").fill("70");

  const leakageText = await page
    .locator("text=Estimated Revenue Leakage")
    .locator("..")
    .innerText();
  const recoveryText = await page
    .locator("text=Potential Revenue Recovery")
    .locator("..")
    .innerText();

  const parseAmount = (text: string) => Number(text.replace(/[^0-9.]/g, ""));
  expect(parseAmount(recoveryText)).toBeLessThanOrEqual(parseAmount(leakageText));
});
