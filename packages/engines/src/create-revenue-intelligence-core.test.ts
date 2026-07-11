import { describe, expect, it } from "vitest";
import { createRevenueIntelligenceCore } from "./create-revenue-intelligence-core";

describe("createRevenueIntelligenceCore", () => {
  it("registers exactly the 10 V1 engines", () => {
    const core = createRevenueIntelligenceCore();

    expect(core.listEngines().sort()).toEqual(
      [
        "RevenueScannerEngine",
        "RevenueHealthEngine",
        "RevenueLeakEngine",
        "RevenueEstimationEngine",
        "RecommendationEngine",
        "RevenueRecoveryEngine",
        "RevenueReportEngine",
        "RevenueCalculatorEngine",
        "MerchantContextEngine",
        "NotificationEngine",
      ].sort()
    );
  });

  it("still-placeholder engines return not_implemented when dispatched", async () => {
    const core = createRevenueIntelligenceCore();
    const context = { merchantId: "11111111-1111-1111-1111-111111111111" };
    const stillPlaceholder = core
      .listEngines()
      .filter((name) => name !== "RevenueScannerEngine" && name !== "RevenueCalculatorEngine");

    for (const name of stillPlaceholder) {
      const result = await core.dispatch(name, {}, context);
      expect(result.status).toBe("not_implemented");
    }
  });

  it("RevenueScannerEngine (Sprint 1) returns a mock report instead of not_implemented", async () => {
    const core = createRevenueIntelligenceCore();
    const context = {};
    const result = await core.dispatch(
      "RevenueScannerEngine",
      { storeUrl: "example-store.myshopify.com" },
      context
    );
    expect(result.status).toBe("success");
  });

  it("RevenueCalculatorEngine (Sprint 1) returns computed output instead of not_implemented", async () => {
    const core = createRevenueIntelligenceCore();
    const context = {};
    const result = await core.dispatch(
      "RevenueCalculatorEngine",
      { monthlyVisitors: 10000, conversionRatePercent: 2, averageOrderValue: 60 },
      context
    );
    expect(result.status).toBe("success");
  });
});
