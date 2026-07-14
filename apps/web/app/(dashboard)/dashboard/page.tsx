import { createServerSupabaseClient, getCurrentUser } from "@revsys/services";
import { getPublicConfig } from "@revsys/shared";
import { AlertTriangle, HeartPulse, TrendingUp, Wallet } from "lucide-react";
import { CommandCenterHeader } from "../../../components/dashboard/command-center-header";
import { EmptyStateConnectStore } from "../../../components/dashboard/empty-state-connect-store";
import { KpiCard } from "../../../components/dashboard/kpi-card";
import { RevenueAdvisorPanel } from "../../../components/dashboard/revenue-advisor-panel";
import { RevenueAlertBanner } from "../../../components/dashboard/revenue-alert-banner";
import { getLatestReport, getMerchantStore } from "../../../lib/dashboard-data";
import { formatUsd } from "../../../lib/format";

export default async function DashboardPage() {
  const config = getPublicConfig();
  const client = await createServerSupabaseClient(
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    config.AUTH_COOKIE_DOMAIN
  );
  const user = await getCurrentUser(client);

  const store = user ? await getMerchantStore(user.id) : null;
  if (!store) {
    return <EmptyStateConnectStore />;
  }

  const report = await getLatestReport(store);
  if (!report) {
    return (
      <div className="space-y-6">
        <CommandCenterHeader
          storeName={store.name}
          lastScanAt={new Date().toISOString()}
          scanStatus="pending"
          shopifyConnected={store.shopifyConnected}
        />
        <p className="text-sm text-muted-foreground">
          No scans yet — click "Run New Scan" above to generate your first Revenue Report.
        </p>
      </div>
    );
  }

  const criticalLeaks = report.leaks.filter((leak) => leak.severity === "critical");
  const topLeak =
    report.leaks
      .filter((leak) => leak.recoveryStatus === "unaddressed")
      .sort((a, b) => b.estimatedImpactHigh - a.estimatedImpactHigh)[0] ?? null;
  const potentialAnnualRecovery = report.monthlyOpportunity * 12;

  return (
    <div className="space-y-6">
      <CommandCenterHeader
        storeName={report.storeName}
        lastScanAt={report.lastScanAt}
        scanStatus={report.scanStatus}
        shopifyConnected={store.shopifyConnected}
      />

      <RevenueAlertBanner
        monthlyOpportunity={report.monthlyOpportunity}
        criticalCount={criticalLeaks.length}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          label="Monthly Opportunity"
          value={formatUsd(report.monthlyOpportunity)}
          icon={Wallet}
          tone="emerald"
        />
        <KpiCard label="Revenue Leaks" value={String(report.leaks.length)} icon={AlertTriangle} tone="warning" />
        <KpiCard label="Critical Leaks" value={String(criticalLeaks.length)} icon={AlertTriangle} tone="coral" />
        <KpiCard
          label="Revenue Health"
          value={`${report.overallHealthScore}/100`}
          icon={HeartPulse}
        />
        <KpiCard
          label="Potential Annual Recovery"
          value={formatUsd(potentialAnnualRecovery)}
          icon={TrendingUp}
          tone="emerald"
        />
      </div>

      <RevenueAdvisorPanel leak={topLeak} />
    </div>
  );
}
