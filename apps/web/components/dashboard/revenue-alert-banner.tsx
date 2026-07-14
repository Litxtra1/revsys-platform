import { Button, Card, CardContent } from "@revsys/ui";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { formatUsd } from "../../lib/format";

export function RevenueAlertBanner({
  monthlyOpportunity,
  criticalCount,
}: {
  monthlyOpportunity: number;
  criticalCount: number;
}) {
  const annualOpportunity = monthlyOpportunity * 12;

  return (
    <Card className="border-coral/30 bg-coral/5">
      <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-coral/15 text-coral">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-coral">
              Estimated Revenue Opportunity
            </div>
            <div className="mt-1 font-heading text-3xl font-semibold tabular-nums text-foreground">
              {formatUsd(monthlyOpportunity)}/month
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {criticalCount} critical revenue {criticalCount === 1 ? "leak" : "leaks"} detected ·{" "}
              {formatUsd(annualOpportunity)} estimated annual opportunity
            </div>
          </div>
        </div>
        <Button asChild size="lg" className="shrink-0">
          <Link href="/dashboard/fixes">View Recovery Plan</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
