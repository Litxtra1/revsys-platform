/**
 * Sprint 1 placeholder data generation. Produces a deterministic, believable
 * Revenue Report from a store URL alone — no real store analysis occurs.
 * Real Revenue Scanner / Health / Leak detection logic is implemented in a
 * future sprint; this generator exists solely to power the public
 * experience end-to-end per the Sprint 1 Brief.
 */

export type LeakSeverity = "low" | "medium" | "high" | "critical";
export type LeakDifficulty = "easy" | "medium" | "hard";
export type LeakRecoveryStatus = "unaddressed" | "in_progress" | "recovered" | "dismissed";

/**
 * Fixed taxonomy for the Revenue Command Center's category navigation.
 * Every LEAK_CATALOG entry's `category` must be one of these.
 */
export const REVENUE_CATEGORIES = [
  "Conversion",
  "Trust Signals",
  "Checkout",
  "Mobile Experience",
  "Product Pages",
  "Collections",
  "SEO",
  "Retention",
  "Speed",
  "Analytics",
  "Pricing",
  "Customer Journey",
] as const;

export type RevenueCategory = (typeof REVENUE_CATEGORIES)[number];

export interface MockRevenueLeak {
  id: string;
  catalogId: string;
  category: RevenueCategory;
  title: string;
  description: string;
  severity: LeakSeverity;
  evidence: string[];
  estimatedImpactLow: number;
  estimatedImpactHigh: number;
  confidence: number;
  difficulty: LeakDifficulty;
  estimatedFixMinutes: number;
  recommendedAction: string;
  recoveryStatus: LeakRecoveryStatus;
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

export interface LeakCatalogEntry {
  catalogId: string;
  category: RevenueCategory;
  title: string;
  description: string;
  evidence: string[];
  recommendedAction: string;
  difficulty: LeakDifficulty;
  estimatedFixMinutes: number;
}

const LEAK_CATALOG: LeakCatalogEntry[] = [
  {
    catalogId: "checkout-friction",
    category: "Checkout",
    title: "Complex Checkout Flow",
    description:
      "Multiple unnecessary steps and form fields are increasing cart abandonment during checkout.",
    evidence: [
      "Checkout requires more than 4 steps to complete",
      "No guest checkout option detected",
    ],
    recommendedAction: "Cut checkout down to two steps and add guest checkout.",
    difficulty: "hard",
    estimatedFixMinutes: 240,
  },
  {
    catalogId: "cart-abandonment",
    category: "Checkout",
    title: "High Cart Abandonment Signals",
    description: "Store shows patterns consistent with elevated cart abandonment.",
    evidence: [
      "No cart recovery messaging detected",
      "Shipping costs not shown until final checkout step",
    ],
    recommendedAction: "Show shipping costs earlier and add cart recovery messaging.",
    difficulty: "medium",
    estimatedFixMinutes: 45,
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
    difficulty: "medium",
    estimatedFixMinutes: 90,
  },
  {
    catalogId: "trust-signals",
    category: "Trust Signals",
    title: "Missing Trust Signals",
    description:
      "Key trust indicators are missing from product and checkout pages, reducing purchase confidence.",
    evidence: [
      "No visible security badges at checkout",
      "Limited customer reviews displayed on product pages",
    ],
    recommendedAction: "Add security badges and visible reviews near the buy button.",
    difficulty: "easy",
    estimatedFixMinutes: 20,
  },
  {
    catalogId: "social-proof",
    category: "Trust Signals",
    title: "Missing Customer Reviews",
    description:
      "Customers hesitate before purchasing products that have little or no social proof.",
    evidence: [
      "Most products contain no customer reviews",
      "No user-generated content on key pages",
    ],
    recommendedAction: "Add a reviews widget and highlight customer photos on key product pages.",
    difficulty: "easy",
    estimatedFixMinutes: 20,
  },
  {
    catalogId: "product-messaging",
    category: "Product Pages",
    title: "Unclear Value Proposition",
    description: "Product pages do not clearly communicate why a visitor should buy now.",
    evidence: [
      "Product descriptions lack benefit-driven language",
      "No urgency or scarcity messaging detected",
    ],
    recommendedAction: "Rewrite product copy around outcomes, not just features.",
    difficulty: "medium",
    estimatedFixMinutes: 60,
  },
  {
    catalogId: "collection-organization",
    category: "Collections",
    title: "Poorly Organized Collections",
    description:
      "Product collections are hard to browse, making it difficult for shoppers to find what they want.",
    evidence: [
      "No filtering or sorting options on collection pages",
      "Collections mix unrelated product types",
    ],
    recommendedAction: "Add filters and sort options, and split mixed collections by product type.",
    difficulty: "medium",
    estimatedFixMinutes: 45,
  },
  {
    catalogId: "technical-seo",
    category: "SEO",
    title: "Technical SEO Gaps",
    description: "Search visibility may be constrained by technical SEO issues.",
    evidence: [
      "Missing structured data on product pages",
      "Meta descriptions missing on key pages",
    ],
    recommendedAction: "Add structured data and fill in missing meta descriptions.",
    difficulty: "medium",
    estimatedFixMinutes: 90,
  },
  {
    catalogId: "retention-gap",
    category: "Retention",
    title: "No Post-Purchase Retention Flow",
    description:
      "Customers aren't hearing from you again after their first purchase, leaving repeat-purchase revenue on the table.",
    evidence: [
      "No post-purchase email flow detected",
      "No loyalty or rewards program visible",
    ],
    recommendedAction: "Set up a post-purchase email flow and a simple loyalty incentive.",
    difficulty: "hard",
    estimatedFixMinutes: 180,
  },
  {
    catalogId: "page-speed",
    category: "Speed",
    title: "Slow Page Load Times",
    description:
      "Page load speed is likely costing conversions, particularly on product and collection pages.",
    evidence: [
      "Largest Contentful Paint above recommended threshold",
      "Unoptimized image assets detected",
    ],
    recommendedAction: "Compress images and remove unnecessary third-party scripts.",
    difficulty: "hard",
    estimatedFixMinutes: 120,
  },
  {
    catalogId: "analytics-blindspot",
    category: "Analytics",
    title: "Incomplete Conversion Tracking",
    description:
      "Key customer actions aren't being tracked, making it hard to know what's actually driving (or losing) revenue.",
    evidence: [
      "Checkout funnel steps not instrumented",
      "No UTM tracking on marketing links",
    ],
    recommendedAction: "Instrument checkout funnel events and tag campaign links with UTM parameters.",
    difficulty: "medium",
    estimatedFixMinutes: 90,
  },
  {
    catalogId: "upsell-opportunity",
    category: "Pricing",
    title: "Missed Upsell Opportunities",
    description: "Store is not surfacing complementary products at key decision points.",
    evidence: ["No cross-sell recommendations on product pages", "No cart-level upsell prompts"],
    recommendedAction: "Add cross-sell suggestions on product pages and at checkout.",
    difficulty: "easy",
    estimatedFixMinutes: 30,
  },
  {
    catalogId: "navigation",
    category: "Customer Journey",
    title: "Navigation Friction",
    description: "Store navigation may make it harder for visitors to find relevant products.",
    evidence: ["Deep category nesting detected", "No visible search bar in primary navigation"],
    recommendedAction: "Flatten your category structure and add a visible search bar.",
    difficulty: "medium",
    estimatedFixMinutes: 60,
  },
  {
    catalogId: "journey-friction",
    category: "Customer Journey",
    title: "Confusing Path From Discovery to Purchase",
    description: "Shoppers take a winding path to purchase, with unclear next steps at each stage.",
    evidence: [
      "No clear next-step prompts on category or product pages",
      "Multiple competing calls-to-action per page",
    ],
    recommendedAction: "Simplify each page to one clear next step toward purchase.",
    difficulty: "hard",
    estimatedFixMinutes: 150,
  },
  {
    catalogId: "conversion-friction",
    category: "Conversion",
    title: "Low-Intent Traffic Not Converting",
    description:
      "Visitors are landing on your site but not moving toward a purchase decision.",
    evidence: [
      "Add-to-cart rate below category benchmark",
      "High bounce rate on landing pages",
    ],
    recommendedAction:
      "Add clearer calls-to-action and simplify the path from landing page to cart.",
    difficulty: "medium",
    estimatedFixMinutes: 60,
  },
];

/**
 * Static catalog text (title/description/recommended action) by catalog ID.
 * DB rows in `revenue_leaks` only persist `leak_catalog_id` plus per-scan
 * numbers (severity/impact/confidence/status) — this is how a reader joins
 * a persisted leak row back to its display copy.
 */
export function getLeakCatalogEntry(catalogId: string): LeakCatalogEntry | undefined {
  return LEAK_CATALOG.find((entry) => entry.catalogId === catalogId);
}

export function getAllLeakCatalogEntries(): readonly LeakCatalogEntry[] {
  return LEAK_CATALOG;
}

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
      difficulty: entry.difficulty,
      estimatedFixMinutes: entry.estimatedFixMinutes,
      recommendedAction: entry.recommendedAction,
      recoveryStatus: "unaddressed",
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

  // Every category gets a score, not just the ones with generated leaks this
  // scan — categories without a detected leak this run still show as healthy.
  const categoryScores: Record<string, number> = {};
  for (const category of REVENUE_CATEGORIES) {
    const categoryLeaks = leaks.filter((leak) => leak.category === category);
    categoryScores[category] =
      categoryLeaks.length === 0
        ? Math.round(80 + random() * 15)
        : Math.max(30, Math.round(85 - categoryLeaks.length * 15 - random() * 10));
  }

  const topOpportunities = sortedBySeverity.slice(0, 3).map((leak) => leak.title);

  const recommendations: MockRecommendation[] = sortedBySeverity
    .slice(0, Math.min(4, sortedBySeverity.length))
    .map((leak) => ({
      title: leak.recommendedAction,
      relatedLeakTitle: leak.title,
      priority: leak.severity,
      expectedOutcome: `Could recover ${formatUsd(leak.estimatedImpactLow)}–${formatUsd(leak.estimatedImpactHigh)}/mo`,
    }));

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
