import { notFound, redirect } from "next/navigation";
import { storeUrlSchema } from "@revsys/shared";
import type { MockRevenueReport } from "@revsys/engines";
import { RevenueReportView } from "../../../components/report/revenue-report-view";
import { revenueIntelligenceCore } from "../../../lib/engines";

interface RevenueReportPageProps {
  searchParams: Promise<{ url?: string }>;
}

export default async function RevenueReportPage({ searchParams }: RevenueReportPageProps) {
  const { url } = await searchParams;

  if (!url) {
    redirect("/revenue-scanner");
  }

  const validation = storeUrlSchema.safeParse(url);
  if (!validation.success) {
    redirect("/revenue-scanner");
  }

  const result = await revenueIntelligenceCore.dispatch<{ storeUrl: string }, MockRevenueReport>(
    "RevenueScannerEngine",
    { storeUrl: validation.data },
    {}
  );

  if (result.status !== "success" || !result.output) {
    notFound();
  }

  return <RevenueReportView report={result.output} />;
}
