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
      "Every extra step in your checkout is a door your customers can walk out of — and right now, yours has too many of them.",
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
    description:
      "Shoppers are filling carts and leaving anyway — a quiet pattern that compounds into real lost revenue every single day it goes unaddressed.",
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
    description:
      "Most of your traffic is on mobile, and it's converting meaningfully worse than desktop — meaning the majority of your visitors are getting the worse experience.",
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
      "Without visible proof that buying from you is safe, hesitant shoppers default to the safest option they have: leaving without buying.",
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
      "No reviews means no proof — and shoppers who can't find proof that others bought and were happy rarely want to be first.",
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
    description:
      "If a visitor can't tell why they should buy today, they assume they can decide later — and later usually means never.",
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
      "Shoppers who can't quickly find what they want don't ask for help — they just leave for a store that makes it easier.",
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
    description:
      "Every day these gaps go unfixed is another day your store stays invisible to shoppers who are already searching for exactly what you sell.",
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
      "Your best customers — the ones who already bought once — are walking away silently, because nothing is bringing them back.",
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
      "Every extra second your pages take to load is a shopper deciding whether you're worth waiting for — and most decide you're not.",
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
      "You can't fix what you can't see — and right now, key moments in your funnel are invisible to you.",
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
    description:
      "Customers who are already buying are the easiest people on earth to sell more to — and right now, you're not even asking.",
    evidence: ["No cross-sell recommendations on product pages", "No cart-level upsell prompts"],
    recommendedAction: "Add cross-sell suggestions on product pages and at checkout.",
    difficulty: "easy",
    estimatedFixMinutes: 30,
  },
  {
    catalogId: "navigation",
    category: "Customer Journey",
    title: "Navigation Friction",
    description: "When shoppers can't find their way to what they want, they don't wander — they leave.",
    evidence: ["Deep category nesting detected", "No visible search bar in primary navigation"],
    recommendedAction: "Flatten your category structure and add a visible search bar.",
    difficulty: "medium",
    estimatedFixMinutes: 60,
  },
  {
    catalogId: "journey-friction",
    category: "Customer Journey",
    title: "Confusing Path From Discovery to Purchase",
    description:
      "Every unclear next step is a moment a shopper can decide to stop — and a confusing journey gives them that moment again and again.",
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
      "Traffic without a nudge to act just drifts back out the way it came in — and that's exactly what's happening here, visit after visit.",
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
    businessImpactSummary: `This store is on pace to lose ${formatUsd(monthlyLeakage)}–${formatUsd(monthlyOpportunity)} this month alone — and every day these ${leaks.length} issues stay unfixed, that number keeps climbing.`,
  };
}
