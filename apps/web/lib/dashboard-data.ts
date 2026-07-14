import { cache } from "react";
import { createServerSupabaseClient } from "@revsys/services";
import { getPublicConfig } from "@revsys/shared";
import { getLeakCatalogEntry, REVENUE_CATEGORIES, type MockRevenueReport } from "@revsys/engines";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@revsys/database";
import { revenueIntelligenceCore } from "./engines";

async function getClient(): Promise<SupabaseClient<Database>> {
  const config = getPublicConfig();
  return createServerSupabaseClient(
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    config.AUTH_COOKIE_DOMAIN
  );
}

// postgrest-js's typed .from()/.select() string-literal inference doesn't
// resolve against this hand-authored Database schema (same pre-existing gap
// noted in apps/web/lib/shopify.server.ts — that's the first code in the
// repo to hit it). Narrow `any` on the query builder only; every
// result below is still explicitly typed at the call site.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function db(client: SupabaseClient<Database>): { from: (table: string) => any } {
  return client as unknown as { from: (table: string) => any };
}

export interface DashboardStore {
  id: string;
  organizationId: string;
  name: string;
  domain: string;
  shopifyConnected: boolean;
}

export const getMerchantStore = cache(async (userId: string): Promise<DashboardStore | null> => {
  const client = await getClient();
  const { data } = await db(client)
    .from("stores")
    .select("id, organization_id, name, domain, shopify_connected")
    .eq("merchant_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    organizationId: data.organization_id,
    name: data.name,
    domain: data.domain,
    shopifyConnected: data.shopify_connected,
  };
});

export interface DashboardLeak {
  id: string;
  catalogId: string;
  category: string;
  title: string;
  description: string;
  recommendedAction: string;
  severity: "low" | "medium" | "high" | "critical";
  evidence: string[];
  estimatedImpactLow: number;
  estimatedImpactHigh: number;
  confidence: number;
  difficulty: "easy" | "medium" | "hard" | null;
  estimatedFixMinutes: number | null;
  recoveryStatus: "unaddressed" | "in_progress" | "recovered" | "dismissed";
}

export interface DashboardReport {
  scanId: string;
  storeId: string;
  storeName: string;
  storeDomain: string;
  lastScanAt: string;
  scanStatus: string;
  confidence: number;
  overallHealthScore: number;
  categoryScores: Record<string, number>;
  monthlyOpportunity: number;
  monthlyLeakage: number;
  businessImpactSummary: string;
  leaks: DashboardLeak[];
}

export const getLatestReport = cache(async (store: DashboardStore): Promise<DashboardReport | null> => {
  const client = await getClient();

  const { data: scan } = await db(client)
    .from("revenue_scans")
    .select("id, status, started_at, completed_at, confidence")
    .eq("store_id", store.id)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!scan) return null;

  const { data: report } = await db(client)
    .from("revenue_reports")
    .select("id, snapshot, revenue_estimate_low, revenue_estimate_high")
    .eq("scan_id", scan.id)
    .maybeSingle();

  const { data: health } = await db(client)
    .from("revenue_health")
    .select("overall_score, category_scores")
    .eq("store_id", store.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: leakRows } = await db(client)
    .from("revenue_leaks")
    .select(
      "id, leak_catalog_id, category, severity, evidence, estimated_revenue_loss_low, estimated_revenue_loss_high, confidence, difficulty, estimated_fix_minutes, recovery_status"
    )
    .eq("revenue_report_id", report?.id ?? "00000000-0000-0000-0000-000000000000")
    .order("created_at", { ascending: true });

  const leaks: DashboardLeak[] = (leakRows ?? []).map(
    (row: {
      id: string;
      leak_catalog_id: string;
      category: string;
      severity: DashboardLeak["severity"];
      evidence: unknown;
      estimated_revenue_loss_low: number | null;
      estimated_revenue_loss_high: number | null;
      confidence: number | null;
      difficulty: DashboardLeak["difficulty"];
      estimated_fix_minutes: number | null;
      recovery_status: DashboardLeak["recoveryStatus"];
    }) => {
      const catalogEntry = getLeakCatalogEntry(row.leak_catalog_id);
      return {
        id: row.id,
        catalogId: row.leak_catalog_id,
        category: row.category,
        title: catalogEntry?.title ?? row.leak_catalog_id,
        description: catalogEntry?.description ?? "",
        recommendedAction: catalogEntry?.recommendedAction ?? "Review this finding with your team.",
        severity: row.severity,
        evidence: Array.isArray(row.evidence) ? (row.evidence as string[]) : [],
        estimatedImpactLow: Number(row.estimated_revenue_loss_low ?? 0),
        estimatedImpactHigh: Number(row.estimated_revenue_loss_high ?? 0),
        confidence: Number(row.confidence ?? 0),
        difficulty: row.difficulty,
        estimatedFixMinutes: row.estimated_fix_minutes,
        recoveryStatus: row.recovery_status,
      };
    }
  );

  const snapshot = (report?.snapshot ?? {}) as Partial<MockRevenueReport>;

  return {
    scanId: scan.id as string,
    storeId: store.id,
    storeName: store.name,
    storeDomain: store.domain,
    lastScanAt: (scan.completed_at as string | null) ?? (scan.started_at as string),
    scanStatus: scan.status as string,
    confidence: Number(scan.confidence ?? snapshot.confidence ?? 0),
    overallHealthScore: Number(health?.overall_score ?? 0),
    categoryScores: (health?.category_scores as Record<string, number> | undefined) ?? {},
    monthlyOpportunity: Number(
      report?.revenue_estimate_high ?? snapshot.revenueEstimate?.monthlyOpportunity ?? 0
    ),
    monthlyLeakage: Number(
      report?.revenue_estimate_low ?? snapshot.revenueEstimate?.monthlyLeakage ?? 0
    ),
    businessImpactSummary: snapshot.businessImpactSummary ?? "",
    leaks,
  };
});

/**
 * Dispatches the real RevenueScannerEngine (finally activating the
 * previously-dead revenueIntelligenceCore singleton) and persists the result
 * as a new scan/report/health/leaks set — this is what makes "Run New Scan"
 * and scan history real instead of ephemeral.
 */
export async function runNewScan(store: DashboardStore, userId: string): Promise<void> {
  const client = await getClient();

  const result = await revenueIntelligenceCore.dispatch<{ storeUrl: string }, MockRevenueReport>(
    "RevenueScannerEngine",
    { storeUrl: store.domain },
    {}
  );
  if (result.status !== "success" || !result.output) {
    throw new Error(result.message ?? "Scan failed.");
  }
  const mockReport = result.output;
  const now = new Date().toISOString();

  const { data: scan, error: scanError } = await db(client)
    .from("revenue_scans")
    .insert({
      store_id: store.id,
      scan_type: "connected",
      status: "completed",
      started_at: now,
      completed_at: now,
      confidence: mockReport.confidence,
      created_by: userId,
    })
    .select("id")
    .single();
  if (scanError || !scan) throw new Error(scanError?.message ?? "Could not save the scan.");

  const criticalCount = mockReport.leaks.filter((leak) => leak.severity === "critical").length;

  const { data: report, error: reportError } = await db(client)
    .from("revenue_reports")
    .insert({
      store_id: store.id,
      scan_id: scan.id,
      revenue_estimate_low: mockReport.revenueEstimate.monthlyLeakage,
      revenue_estimate_high: mockReport.revenueEstimate.monthlyOpportunity,
      recovery_priority: criticalCount > 0 ? "critical" : "medium",
      snapshot: mockReport,
      created_by: userId,
    })
    .select("id")
    .single();
  if (reportError || !report) throw new Error(reportError?.message ?? "Could not save the report.");

  await db(client)
    .from("revenue_health")
    .insert({
      store_id: store.id,
      overall_score: mockReport.revenueHealth.overallScore,
      category_scores: mockReport.revenueHealth.categoryScores,
      confidence: mockReport.confidence,
      created_by: userId,
    });

  const leakRows = mockReport.leaks.map((leak) => ({
    store_id: store.id,
    revenue_report_id: report.id,
    leak_catalog_id: leak.catalogId,
    category: leak.category,
    severity: leak.severity,
    evidence: leak.evidence,
    estimated_revenue_loss_low: leak.estimatedImpactLow,
    estimated_revenue_loss_high: leak.estimatedImpactHigh,
    confidence: leak.confidence,
    difficulty: leak.difficulty,
    estimated_fix_minutes: leak.estimatedFixMinutes,
    recovery_status: leak.recoveryStatus,
    created_by: userId,
  }));
  await db(client).from("revenue_leaks").insert(leakRows);
}

export async function updateLeakStatus(
  leakId: string,
  status: DashboardLeak["recoveryStatus"]
): Promise<void> {
  const client = await getClient();
  await db(client).from("revenue_leaks").update({ recovery_status: status }).eq("id", leakId);
}

export interface IntegrationDetails {
  provider: string;
  status: string;
  connectedAt: string | null;
}

export async function getStoreIntegrations(storeId: string): Promise<IntegrationDetails[]> {
  const client = await getClient();
  const { data } = await db(client)
    .from("integrations")
    .select("provider, status, connected_at")
    .eq("store_id", storeId);

  return (data ?? []).map((row: { provider: string; status: string; connected_at: string | null }) => ({
    provider: row.provider,
    status: row.status,
    connectedAt: row.connected_at,
  }));
}

export interface ScanHistoryEntry {
  id: string;
  startedAt: string;
  completedAt: string | null;
  status: string;
  confidence: number | null;
  monthlyOpportunity: number | null;
}

/** Powers the scan-history view — "Track Progress" / "Run Continuous Scans"
 * only means something if past scans are actually visible over time. */
export async function getScanHistory(storeId: string): Promise<ScanHistoryEntry[]> {
  const client = await getClient();
  const { data: scans } = await db(client)
    .from("revenue_scans")
    .select("id, started_at, completed_at, status, confidence")
    .eq("store_id", storeId)
    .order("started_at", { ascending: false })
    .limit(10);

  if (!scans || scans.length === 0) return [];

  const scanIds = scans.map((scan: { id: string }) => scan.id);
  const { data: reports } = await db(client)
    .from("revenue_reports")
    .select("scan_id, revenue_estimate_high")
    .in("scan_id", scanIds);

  const opportunityByScanId = new Map(
    (reports ?? []).map((report: { scan_id: string; revenue_estimate_high: number | null }) => [
      report.scan_id,
      report.revenue_estimate_high,
    ])
  );

  return scans.map(
    (scan: {
      id: string;
      started_at: string;
      completed_at: string | null;
      status: string;
      confidence: number | null;
    }) => ({
      id: scan.id,
      startedAt: scan.started_at,
      completedAt: scan.completed_at,
      status: scan.status,
      confidence: scan.confidence,
      monthlyOpportunity: opportunityByScanId.get(scan.id) ?? null,
    })
  );
}

export function groupLeaksByCategory(leaks: DashboardLeak[]): Map<string, DashboardLeak[]> {
  const map = new Map<string, DashboardLeak[]>();
  for (const leak of leaks) {
    const list = map.get(leak.category) ?? [];
    list.push(leak);
    map.set(leak.category, list);
  }
  return map;
}

export interface CategorySummary {
  category: string;
  issueCount: number;
  monthlyImpact: number;
  priority: "critical" | "high" | "medium" | "low" | "none";
}

const PRIORITY_RANK: Record<DashboardLeak["severity"], CategorySummary["priority"]> = {
  critical: "critical",
  high: "high",
  medium: "medium",
  low: "low",
};

/** Every category in the fixed taxonomy, even ones with zero detected leaks
 * this scan — the sidebar always shows all 12, not just the ones with issues. */
export function computeCategorySummaries(leaks: DashboardLeak[]): CategorySummary[] {
  return REVENUE_CATEGORIES.map((category) => {
    const categoryLeaks = leaks.filter((leak) => leak.category === category);
    const monthlyImpact = categoryLeaks.reduce(
      (sum, leak) => sum + (leak.estimatedImpactLow + leak.estimatedImpactHigh) / 2,
      0
    );
    const priority: CategorySummary["priority"] =
      categoryLeaks
        .map((leak) => PRIORITY_RANK[leak.severity])
        .sort((a, b) => rank(b) - rank(a))[0] ?? "none";

    return { category, issueCount: categoryLeaks.length, monthlyImpact, priority };
  });
}

function rank(priority: CategorySummary["priority"]): number {
  return { critical: 4, high: 3, medium: 2, low: 1, none: 0 }[priority];
}
