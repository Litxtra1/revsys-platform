import { Badge } from "@revsys/ui";
import type { DashboardLeak } from "../../lib/dashboard-data";
import { formatFixTime, formatUsd } from "../../lib/format";
import { StatusSelect } from "./status-select";

const SEVERITY_VARIANT: Record<DashboardLeak["severity"], "destructive" | "warning" | "secondary"> = {
  critical: "destructive",
  high: "warning",
  medium: "warning",
  low: "secondary",
};

const DIFFICULTY_LABEL: Record<NonNullable<DashboardLeak["difficulty"]>, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export function LeakCard({ leak }: { leak: DashboardLeak }) {
  const recoveryMid = Math.round((leak.estimatedImpactLow + leak.estimatedImpactHigh) / 2);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-heading text-base font-semibold">{leak.title}</div>
          <div className="mt-1 text-sm text-muted-foreground">{leak.description}</div>
        </div>
        <Badge variant={SEVERITY_VARIANT[leak.severity]} className="shrink-0 capitalize">
          {leak.severity}
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Metric label="Monthly Loss" value={formatUsd(recoveryMid)} />
        <Metric label="Confidence" value={`${leak.confidence}%`} />
        <Metric label="Difficulty" value={leak.difficulty ? DIFFICULTY_LABEL[leak.difficulty] : "—"} />
        <Metric label="Est. Fix Time" value={formatFixTime(leak.estimatedFixMinutes)} />
      </div>

      {leak.evidence.length > 0 ? (
        <div className="mt-4 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          <div className="font-medium text-foreground">Evidence</div>
          <ul className="mt-1 list-disc space-y-0.5 pl-4">
            {leak.evidence.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div className="text-sm">
          <span className="text-muted-foreground">Recommended: </span>
          <span className="font-medium">{leak.recommendedAction}</span>
        </div>
        <StatusSelect leakId={leak.id} status={leak.recoveryStatus} />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium tabular-nums">{value}</div>
    </div>
  );
}
