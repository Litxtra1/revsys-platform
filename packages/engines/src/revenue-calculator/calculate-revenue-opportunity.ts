/**
 * Real, deterministic (non-AI) benchmark math per the Sprint 1 Brief.
 * Not AI-driven and not specific to any real store — a generic revenue
 * opportunity estimate based on user-supplied inputs and industry benchmark
 * assumptions.
 */

export interface RevenueCalculatorInput {
  monthlyVisitors: number;
  conversionRatePercent: number;
  averageOrderValue: number;
  /** Optional: monthly ad spend. When provided, ROAS/wasted-spend fields are also returned. */
  monthlyAdSpend?: number;
}

export interface RevenueCalculatorOutput {
  currentMonthlyRevenue: number;
  potentialMonthlyRevenue: number;
  potentialConversionRatePercent: number;
  estimatedRevenueLeakage: number;
  potentialRevenueRecovery: number;
  /** Only present when input.monthlyAdSpend was provided. */
  currentRoas?: number;
  potentialRoas?: number;
  /** Portion of ad spend not converting as efficiently as it could at benchmark conversion. */
  wastedAdSpend?: number;
}

const MAX_REALISTIC_CONVERSION_RATE = 15;
const RECOVERABLE_SHARE_OF_GAP = 0.6;

export function calculateRevenueOpportunity(
  input: RevenueCalculatorInput
): RevenueCalculatorOutput {
  const monthlyVisitors = Math.max(0, input.monthlyVisitors);
  const conversionRatePercent = Math.min(100, Math.max(0, input.conversionRatePercent));
  const averageOrderValue = Math.max(0, input.averageOrderValue);

  const currentMonthlyRevenue = monthlyVisitors * (conversionRatePercent / 100) * averageOrderValue;

  const potentialConversionRatePercent = Math.min(
    MAX_REALISTIC_CONVERSION_RATE,
    Math.max(conversionRatePercent * 1.35, conversionRatePercent + 3)
  );

  const potentialMonthlyRevenue =
    monthlyVisitors * (potentialConversionRatePercent / 100) * averageOrderValue;

  const estimatedRevenueLeakage = Math.max(0, potentialMonthlyRevenue - currentMonthlyRevenue);
  const potentialRevenueRecovery = estimatedRevenueLeakage * RECOVERABLE_SHARE_OF_GAP;

  let roasFields: Pick<RevenueCalculatorOutput, "currentRoas" | "potentialRoas" | "wastedAdSpend"> | undefined;
  if (input.monthlyAdSpend !== undefined) {
    const monthlyAdSpend = Math.max(0, input.monthlyAdSpend);
    if (monthlyAdSpend > 0) {
      const currentRoas = Math.round((currentMonthlyRevenue / monthlyAdSpend) * 100) / 100;
      const potentialRoas = Math.round((potentialMonthlyRevenue / monthlyAdSpend) * 100) / 100;
      const wastedAdSpend =
        potentialRoas > 0 ? Math.round(monthlyAdSpend * (1 - currentRoas / potentialRoas)) : 0;
      roasFields = { currentRoas, potentialRoas, wastedAdSpend };
    } else {
      roasFields = { currentRoas: 0, potentialRoas: 0, wastedAdSpend: 0 };
    }
  }

  return {
    currentMonthlyRevenue: Math.round(currentMonthlyRevenue),
    potentialMonthlyRevenue: Math.round(potentialMonthlyRevenue),
    potentialConversionRatePercent: Math.round(potentialConversionRatePercent * 100) / 100,
    estimatedRevenueLeakage: Math.round(estimatedRevenueLeakage),
    potentialRevenueRecovery: Math.round(potentialRevenueRecovery),
    ...(roasFields ?? {}),
  };
}
