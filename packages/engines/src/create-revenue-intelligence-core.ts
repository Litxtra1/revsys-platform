import { RevenueIntelligenceCore } from "./core/revenue-intelligence-core";
import { RevenueScannerEngine } from "./revenue-scanner/revenue-scanner-engine";
import { RevenueHealthEngine } from "./revenue-health/revenue-health-engine";
import { RevenueLeakEngine } from "./revenue-leak/revenue-leak-engine";
import { RevenueEstimationEngine } from "./revenue-estimation/revenue-estimation-engine";
import { RecommendationEngine } from "./recommendation/recommendation-engine";
import { RevenueRecoveryEngine } from "./revenue-recovery/revenue-recovery-engine";
import { RevenueReportEngine } from "./revenue-report/revenue-report-engine";
import { RevenueCalculatorEngine } from "./revenue-calculator/revenue-calculator-engine";
import { MerchantContextEngine } from "./merchant-context/merchant-context-engine";
import { NotificationEngine } from "./notification/notification-engine";

/**
 * Builds a RevenueIntelligenceCore with every V1 engine registered.
 * Registration only — no orchestration or workflow logic.
 */
export function createRevenueIntelligenceCore(): RevenueIntelligenceCore {
  const core = new RevenueIntelligenceCore();

  core.register(new RevenueScannerEngine());
  core.register(new RevenueHealthEngine());
  core.register(new RevenueLeakEngine());
  core.register(new RevenueEstimationEngine());
  core.register(new RecommendationEngine());
  core.register(new RevenueRecoveryEngine());
  core.register(new RevenueReportEngine());
  core.register(new RevenueCalculatorEngine());
  core.register(new MerchantContextEngine());
  core.register(new NotificationEngine());

  return core;
}
