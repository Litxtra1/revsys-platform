import { Button, Card, CardContent } from "@revsys/ui";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import type { DashboardLeak } from "../../lib/dashboard-data";
import { formatFixTime, formatUsd } from "../../lib/format";

export function RevenueAdvisorPanel({ leak }: { leak: DashboardLeak | null }) {
  if (!leak) {
    return (
      <Card className="p-6">
        <CardContent className="p-0 text-sm text-muted-foreground">
          No open recommendations right now — run a new scan to check for fresh opportunities.
        </CardContent>
      </Card>
    );
  }

  const recoveryMid = Math.round((leak.estimatedImpactLow + leak.estimatedImpactHigh) / 2);

  return (
    <Card className="border-emerald/20">
      <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald/15 text-emerald">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald">
              Today's Recommendation
            </div>
            <div className="mt-1 font-heading text-lg font-semibold">Improve {leak.category}</div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>
                Estimated recovery:{" "}
                <strong className="font-medium text-foreground">{formatUsd(recoveryMid)}/mo</strong>
              </span>
              <span>
                Est. time:{" "}
                <strong className="font-medium text-foreground">
                  {formatFixTime(leak.estimatedFixMinutes)}
                </strong>
              </span>
              <span>
                Confidence:{" "}
                <strong className="font-medium text-foreground">{leak.confidence}%</strong>
              </span>
            </div>
          </div>
        </div>
        <Button asChild className="shrink-0">
          <Link href={`/dashboard/category/${encodeURIComponent(leak.category)}`}>
            Start Recovery Plan
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
