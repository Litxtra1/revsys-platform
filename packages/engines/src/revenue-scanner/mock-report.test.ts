import { describe, expect, it } from "vitest";
import { generateMockRevenueReport, normalizeStoreUrl, REVENUE_CATEGORIES } from "./mock-report";

describe("normalizeStoreUrl", () => {
  it("strips protocol, trailing slash, and casing differences", () => {
    expect(normalizeStoreUrl("https://Example-Store.myshopify.com/")).toBe(
      "example-store.myshopify.com"
    );
    expect(normalizeStoreUrl("http://example-store.myshopify.com")).toBe(
      "example-store.myshopify.com"
    );
  });
});

describe("generateMockRevenueReport", () => {
  it("is deterministic for the same store URL", () => {
    const first = generateMockRevenueReport("example-store.myshopify.com");
    const second = generateMockRevenueReport("example-store.myshopify.com");

    expect(second.revenueHealth.overallScore).toBe(first.revenueHealth.overallScore);
    expect(second.revenueEstimate).toEqual(first.revenueEstimate);
    expect(second.leaks.map((leak) => leak.id)).toEqual(first.leaks.map((leak) => leak.id));
    expect(second.scanId).toBe(first.scanId);
  });

  it("is stable across equivalent URL formats (protocol, trailing slash, casing)", () => {
    const bare = generateMockRevenueReport("example-store.myshopify.com");
    const withProtocol = generateMockRevenueReport("https://Example-Store.myshopify.com/");

    expect(withProtocol.scanId).toBe(bare.scanId);
    expect(withProtocol.revenueHealth.overallScore).toBe(bare.revenueHealth.overallScore);
  });

  it("produces different reports for different store URLs", () => {
    const a = generateMockRevenueReport("store-a.myshopify.com");
    const b = generateMockRevenueReport("store-b.myshopify.com");

    expect(a.scanId).not.toBe(b.scanId);
  });

  it("produces a well-formed report", () => {
    const report = generateMockRevenueReport("well-formed-store.myshopify.com");

    expect(report.leaks.length).toBeGreaterThanOrEqual(4);
    expect(report.leaks.length).toBeLessThanOrEqual(6);
    expect(report.revenueHealth.overallScore).toBeGreaterThanOrEqual(35);
    expect(report.revenueHealth.overallScore).toBeLessThanOrEqual(92);
    expect(report.confidence).toBeGreaterThanOrEqual(65);
    expect(report.confidence).toBeLessThanOrEqual(90);
    expect(report.revenueEstimate.monthlyOpportunity).toBeGreaterThan(
      report.revenueEstimate.monthlyLeakage
    );

    // Leaks sorted by severity, most severe first.
    const severityRank = { critical: 3, high: 2, medium: 1, low: 0 };
    for (let i = 1; i < report.leaks.length; i += 1) {
      expect(severityRank[report.leaks[i - 1]!.severity]).toBeGreaterThanOrEqual(
        severityRank[report.leaks[i]!.severity]
      );
    }

    // No duplicate leak categories from the catalog.
    const catalogIds = report.leaks.map((leak) => leak.catalogId);
    expect(new Set(catalogIds).size).toBe(catalogIds.length);
  });

  it("produces recommendations tied to real detected leaks", () => {
    const report = generateMockRevenueReport("recommendation-store.myshopify.com");

    expect(report.recommendations.length).toBeGreaterThan(0);
    expect(report.recommendations.length).toBeLessThanOrEqual(4);

    const leakTitles = new Set(report.leaks.map((leak) => leak.title));
    for (const recommendation of report.recommendations) {
      expect(leakTitles.has(recommendation.relatedLeakTitle)).toBe(true);
      expect(recommendation.title.length).toBeGreaterThan(0);
      expect(recommendation.expectedOutcome).toMatch(/\$/);
    }
  });

  it("every generated leak carries Command Center fields (difficulty, fix time, category, status)", () => {
    const report = generateMockRevenueReport("command-center-store.myshopify.com");

    for (const leak of report.leaks) {
      expect(["easy", "medium", "hard"]).toContain(leak.difficulty);
      expect(leak.estimatedFixMinutes).toBeGreaterThan(0);
      expect(leak.recommendedAction.length).toBeGreaterThan(0);
      expect(leak.recoveryStatus).toBe("unaddressed");
      expect(REVENUE_CATEGORIES).toContain(leak.category);
    }
  });

  it("scores every category, not just ones with a detected leak this scan", () => {
    const report = generateMockRevenueReport("category-coverage-store.myshopify.com");

    for (const category of REVENUE_CATEGORIES) {
      expect(report.revenueHealth.categoryScores[category]).toBeGreaterThanOrEqual(0);
      expect(report.revenueHealth.categoryScores[category]).toBeLessThanOrEqual(100);
    }
  });
});
