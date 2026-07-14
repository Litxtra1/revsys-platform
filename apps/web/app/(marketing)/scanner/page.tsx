import type { Metadata } from "next";
import type { MockRevenueReport } from "@revsys/engines";
import { ScannerContent } from "../../../components/marketing/scanner-content";
import { revenueIntelligenceCore } from "../../../lib/engines";

export const metadata: Metadata = {
  title: "Revenue Scanner — Revsys AI",
  description:
    "A business investigation, not a loading bar. Five parallel audits translate every finding into recoverable revenue you can act on today.",
  openGraph: {
    title: "Revenue Scanner — Revsys AI",
    description:
      "See exactly where your Shopify store is leaking revenue in a consulting-grade report — free, in 90 seconds.",
  },
};

export default async function ScannerPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string }>;
}) {
  const { url } = await searchParams;
  const report = await getReport(url);
  return <ScannerContent report={report} />;
}

async function getReport(url: string | undefined): Promise<MockRevenueReport | null> {
  if (!url) return null;
  const result = await revenueIntelligenceCore.dispatch<{ storeUrl: string }, MockRevenueReport>(
    "RevenueScannerEngine",
    { storeUrl: url },
    {}
  );
  return result.status === "success" && result.output ? result.output : null;
}
