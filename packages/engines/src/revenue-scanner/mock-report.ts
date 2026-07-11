/**
 * Sprint 1 placeholder data generation. Produces a deterministic, believable
 * Revenue Report from a store URL alone — no real store analysis occurs.
 * Real Revenue Scanner / Health / Leak detection logic is implemented in a
 * future sprint; this generator exists solely to power the public
 * experience end-to-end per the Sprint 1 Brief.
 */

export type LeakSeverity = "low" | "medium" | "high" | "critical";

export interface MockRevenueLeak {
  id: string;
  catalogId: string;
  category: string;
  title: string;
  description: string;
  severity: LeakSeverity;
  evidence: string[];
  estimatedImpactLow: number;
  estimatedImpactHigh: number;
  confidence: number;
}

export interface MockRevenueHealth {
  overallScore: number;
  categoryScores: Record<string, number>;
}

export interface MockRevenueEstimate {
  currency: "USD";
  monthlyOpportunity: number;
  monthlyLeakage: number;
}

export interface MockRecoveryOpportunities {
  totalPotentialRecovery: number;
  topOpportunities: string[];
}

export interface MockRecommendation {
  title: string;
  relatedLeakTitle: string;
  priority: LeakSeverity;
  expectedOutcome: string;
}

export interface MockRevenueReport {
  scanId: string;
  storeUrl: string;
  generatedAt: string;
  confidence: number;
  revenueHealth: MockRevenueHealth;
  revenueEstimate: MockRevenueEstimate;
  leaks: MockRevenueLeak[];
  recoveryOpportunities: MockRecoveryOpportunities;
  recommendations: MockRecommendation[];
  nextSteps: string[];
  businessImpactSummary: string;
}

interface LeakCatalogEntry {
  catalogId: string;
  category: string;
  title: string;
  description: string;
  evidence: string[];
  recommendedAction: string;
}

const LEAK_CATALOG: LeakCatalogEntry[] = [
  {
    catalogId: "checkout-friction",
    category: "Checkout Experience",
    title: "Complex Checkout Flow",
    description:
      "Multiple unnecessary steps and form fields are increasing cart abandonment during checkout.",
    evidence: [
      "Checkout requires more than 4 steps to complete",
      "No guest checkout option detected",
    ],
    recommendedAction: "Cut checkout down to two steps and add guest checkout.",
  },
  {
    catalogId: "mobile-experience",
    category: "Mobile Experience",
    title: "Mobile Conversion Gaps",
    description: "Mobile visitors convert at a meaningfully lower rate than desktop visitors.",
    evidence: [
      "Tap targets below recommended size on product pages",
      "Mobile page weight exceeds best-practice thresholds",
    ],
    recommendedAction: "Resize tap targets and compress mobile page assets.",
  },
  {
    catalogId: "trust-signals",
    category: "Trust & Credibility",
    title: "Missing Trust Signals",
    description:
      "Key trust indicators are missing from product and checkout pages, reducing purchase confidence.",
    evidence: [
      "No visible security badges at checkout",
      "Limited customer reviews displayed on product pages",
    ],
    recommendedAction: "Add security badges and visible reviews near the buy button.",
  },
  {
    catalogId: "product-messaging",
    category: "Product Messaging",
    title: "Unclear Value Proposition",
    description: "Product pages do not clearly communicate why a visitor should buy now.",
    evidence: [
      "Product descriptions lack benefit-driven language",
      "No urgency or scarcity messaging detected",
    ],
    recommendedAction: "Rewrite product copy around outcomes, not just features.",
  },
  {
    catalogId: "page-speed",
    category: "Technical Performance",
    title: "Slow Page Load Times",
    description:
      "Page load speed is likely costing conversions, particularly on product and collection pages.",
    evidence: [
      "Largest Contentful Paint above recommended threshold",
      "Unoptimized image assets detected",
    ],
    recommendedAction: "Compress images and remove unnecessary third-party scripts.",
  },
  {
    catalogId: "cart-abandonment",
    category: "Cart & Checkout",
    title: "High Cart Abandonment Signals",
    description: "Store shows patterns consistent with elevated cart abandonment.",
    evidence: [
      "No cart recovery messaging detected",
      "Shipping costs not shown until final checkout step",
    ],
    recommendedAction: "Show shipping costs earlier and add cart recovery messaging.",
  },
  {
    catalogId: "technical-seo",
    category: "Discoverability",
    title: "Technical SEO Gaps",
    description: "Search visibility may be constrained by technical SEO issues.",
    evidence: [
      "Missing structured data on product pages",
      "Meta descriptions missing on key pages",
    ],
    recommendedAction: "Add structured data and fill in missing meta descriptions.",
  },
  {
    catalogId: "navigation",
    category: "Site Navigation",
    title: "Navigation Friction",
    description: "Store navigation may make it harder for visitors to find relevant products.",
    evidence: ["Deep category nesting detected", "No visible search bar in primary navigation"],
    recommendedAction: "Flatten your category structure and add a visible search bar.",
  },
  {
    catalogId: "social-proof",
    category: "Trust & Credibility",
    title: "Insufficient Social Proof",
    description:
      "Limited visible evidence of other customers' satisfaction may be reducing buyer confidence.",
    evidence: ["Review counts below category benchmark", "No user-generated content on key pages"],
    recommendedAction: "Highlight customer reviews and photos on key product pages.",
  },
  {
    catalogId: "upsell-opportunity",
    category: "Average Order Value",
    title: "Missed Upsell Opportunities",
    description: "Store is not surfacing complementary products at key decision points.",
    evidence: ["No cross-sell recommendations on product pages", "No cart-level upsell prompts"],
    recommendedAction: "Add cross-sell suggestions on product pages and at checkout.",
  },
];

const SEVERITIES: LeakSeverity[] = ["low", "medium", "high", "critical"];

const SEVERITY_IMPACT_RANGE: Record<LeakSeverity, [number, number]> = {
  low: [200, 800],
  medium: [800, 2500],
  high: [2500, 6000],
  critical: [6000, 15000],
};

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const temp = result[i]!;
    result[i] = result[j]!;
    result[j] = temp;
  }
  return result;
}

function pickSeverity(random: () => number): LeakSeverity {
  const roll = random();
  if (roll > 0.85) return "critical";
  if (roll > 0.6) return "high";
  if (roll > 0.3) return "medium";
  return "low";
}

function formatUsd(amount: number): string {
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}

export function normalizeStoreUrl(storeUrl: string): string {
  return storeUrl
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
}

export function generateMockRevenueReport(storeUrl: string): MockRevenueReport {
  const normalized = normalizeStoreUrl(storeUrl);
  const seed = hashString(normalized);
  const random = mulberry32(seed);

  const leakCount = 4 + Math.floor(random() * 3);
  const chosenEntries = shuffle(LEAK_CATALOG, random).slice(0, leakCount);

  const leaks: MockRevenueLeak[] = chosenEntries.map((entry, index) => {
    const severity = pickSeverity(random);
    const [low, high] = SEVERITY_IMPACT_RANGE[severity];
    const impactLow = Math.round(low + random() * (high - low) * 0.3);
    const impactHigh = Math.round(impactLow + (high - impactLow) * (0.4 + random() * 0.4));
    return {
      id: `${normalized}-leak-${index + 1}`,
      catalogId: entry.catalogId,
      category: entry.category,
      title: entry.title,
      description: entry.description,
      severity,
      evidence: entry.evidence,
      estimatedImpactLow: impactLow,
      estimatedImpactHigh: impactHigh,
      confidence: Math.round(60 + random() * 30),
    };
  });

  const sortedBySeverity = [...leaks].sort(
    (a, b) => SEVERITIES.indexOf(b.severity) - SEVERITIES.indexOf(a.severity)
  );

  const totalLeakageLow = leaks.reduce((sum, leak) => sum + leak.estimatedImpactLow, 0);
  const totalLeakageHigh = leaks.reduce((sum, leak) => sum + leak.estimatedImpactHigh, 0);
  const monthlyLeakage = Math.round((totalLeakageLow + totalLeakageHigh) / 2);
  const monthlyOpportunity = Math.round(monthlyLeakage * (1.15 + random() * 0.35));

  const criticalCount = leaks.filter((leak) => leak.severity === "critical").length;
  const highCount = leaks.filter((leak) => leak.severity === "high").length;
  const overallScore = Math.max(
    35,
    Math.min(92, Math.round(88 - criticalCount * 12 - highCount * 6 - leaks.length * 2))
  );

  const categoryScores: Record<string, number> = {
    "Checkout Experience": Math.round(50 + random() * 45),
    "Mobile Experience": Math.round(50 + random() * 45),
    "Trust & Credibility": Math.round(50 + random() * 45),
    "Technical Performance": Math.round(50 + random() * 45),
    Discoverability: Math.round(50 + random() * 45),
  };

  const topOpportunities = sortedBySeverity.slice(0, 3).map((leak) => leak.title);

  const recommendations: MockRecommendation[] = sortedBySeverity
    .slice(0, Math.min(4, sortedBySeverity.length))
    .map((leak) => {
      const catalogEntry = LEAK_CATALOG.find((entry) => entry.catalogId === leak.catalogId);
      return {
        title: catalogEntry?.recommendedAction ?? "Review this finding with your team.",
        relatedLeakTitle: leak.title,
        priority: leak.severity,
        expectedOutcome: `Could recover ${formatUsd(leak.estimatedImpactLow)}–${formatUsd(leak.estimatedImpactHigh)}/mo`,
      };
    });

  return {
    scanId: `scan-${seed.toString(36)}`,
    storeUrl: normalized,
    generatedAt: new Date().toISOString(),
    confidence: Math.round(65 + random() * 25),
    revenueHealth: { overallScore, categoryScores },
    revenueEstimate: {
      currency: "USD",
      monthlyOpportunity,
      monthlyLeakage,
    },
    leaks: sortedBySeverity,
    recoveryOpportunities: {
      totalPotentialRecovery: Math.round(monthlyLeakage * (0.35 + random() * 0.25)),
      topOpportunities,
    },
    recommendations,
    nextSteps: [
      "Start with the highest-priority leak below.",
      "Connect your Shopify store for a deeper, store-specific report.",
      "Talk to our team about a free recovery plan review.",
    ],
    businessImpactSummary: `This store could be leaving ${formatUsd(monthlyLeakage)} to ${formatUsd(monthlyOpportunity)} a month on the table across ${leaks.length} issues.`,
  };
}
