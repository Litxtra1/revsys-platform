import { describe, expect, it } from "vitest";
import { calculateRevenueOpportunity } from "./calculate-revenue-opportunity";

describe("calculateRevenueOpportunity", () => {
  it("computes current monthly revenue as visitors x conversion rate x AOV", () => {
    const result = calculateRevenueOpportunity({
      monthlyVisitors: 10000,
      conversionRatePercent: 2,
      averageOrderValue: 50,
    });

    // 10000 * 0.02 * 50 = 10000
    expect(result.currentMonthlyRevenue).toBe(10000);
  });

  it("potential revenue is always greater than or equal to current revenue", () => {
    const result = calculateRevenueOpportunity({
      monthlyVisitors: 5000,
      conversionRatePercent: 3,
      averageOrderValue: 80,
    });

    expect(result.potentialMonthlyRevenue).toBeGreaterThanOrEqual(result.currentMonthlyRevenue);
  });

  it("leakage equals potential minus current revenue", () => {
    const result = calculateRevenueOpportunity({
      monthlyVisitors: 8000,
      conversionRatePercent: 1.5,
      averageOrderValue: 60,
    });

    expect(result.estimatedRevenueLeakage).toBe(
      result.potentialMonthlyRevenue - result.currentMonthlyRevenue
    );
  });

  it("recovery is a fraction of the leakage, never exceeding it", () => {
    const result = calculateRevenueOpportunity({
      monthlyVisitors: 12000,
      conversionRatePercent: 2.5,
      averageOrderValue: 45,
    });

    expect(result.potentialRevenueRecovery).toBeLessThanOrEqual(result.estimatedRevenueLeakage);
    expect(result.potentialRevenueRecovery).toBeGreaterThan(0);
  });

  it("caps the potential conversion rate at a realistic ceiling", () => {
    const result = calculateRevenueOpportunity({
      monthlyVisitors: 1000,
      conversionRatePercent: 14,
      averageOrderValue: 100,
    });

    expect(result.potentialConversionRatePercent).toBeLessThanOrEqual(15);
  });

  it("clamps negative or out-of-range inputs instead of producing invalid output", () => {
    const result = calculateRevenueOpportunity({
      monthlyVisitors: -500,
      conversionRatePercent: 250,
      averageOrderValue: -10,
    });

    expect(result.currentMonthlyRevenue).toBeGreaterThanOrEqual(0);
    expect(result.estimatedRevenueLeakage).toBeGreaterThanOrEqual(0);
    expect(result.potentialRevenueRecovery).toBeGreaterThanOrEqual(0);
  });

  it("returns zero across the board for zero inputs", () => {
    const result = calculateRevenueOpportunity({
      monthlyVisitors: 0,
      conversionRatePercent: 0,
      averageOrderValue: 0,
    });

    expect(result.currentMonthlyRevenue).toBe(0);
    expect(result.potentialMonthlyRevenue).toBe(0);
    expect(result.estimatedRevenueLeakage).toBe(0);
    expect(result.potentialRevenueRecovery).toBe(0);
  });

  it("omits ROAS fields entirely when no ad spend is supplied", () => {
    const result = calculateRevenueOpportunity({
      monthlyVisitors: 10000,
      conversionRatePercent: 2,
      averageOrderValue: 50,
    });

    expect(result.currentRoas).toBeUndefined();
    expect(result.potentialRoas).toBeUndefined();
    expect(result.wastedAdSpend).toBeUndefined();
  });

  it("computes ROAS as revenue divided by ad spend", () => {
    const result = calculateRevenueOpportunity({
      monthlyVisitors: 10000,
      conversionRatePercent: 2,
      averageOrderValue: 50,
      monthlyAdSpend: 2000,
    });

    // currentMonthlyRevenue = 10000, so ROAS = 10000 / 2000 = 5
    expect(result.currentRoas).toBe(5);
    expect(result.potentialRoas).toBeGreaterThanOrEqual(result.currentRoas ?? 0);
  });

  it("wasted ad spend is zero when current ROAS already matches potential ROAS", () => {
    const result = calculateRevenueOpportunity({
      monthlyVisitors: 1000,
      conversionRatePercent: 15,
      averageOrderValue: 50,
      monthlyAdSpend: 500,
    });

    // Conversion is already at the realistic ceiling, so current == potential.
    expect(result.currentRoas).toBe(result.potentialRoas);
    expect(result.wastedAdSpend).toBe(0);
  });

  it("wasted ad spend never exceeds the ad spend itself", () => {
    const result = calculateRevenueOpportunity({
      monthlyVisitors: 8000,
      conversionRatePercent: 1,
      averageOrderValue: 60,
      monthlyAdSpend: 3000,
    });

    expect(result.wastedAdSpend).toBeGreaterThanOrEqual(0);
    expect(result.wastedAdSpend).toBeLessThanOrEqual(3000);
  });

  it("handles zero ad spend without dividing by zero", () => {
    const result = calculateRevenueOpportunity({
      monthlyVisitors: 5000,
      conversionRatePercent: 2,
      averageOrderValue: 40,
      monthlyAdSpend: 0,
    });

    expect(result.currentRoas).toBe(0);
    expect(result.potentialRoas).toBe(0);
    expect(result.wastedAdSpend).toBe(0);
  });
});
