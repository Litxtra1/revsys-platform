import { Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@revsys/ui";
import type { DashboardLeak } from "../../lib/dashboard-data";
import { formatFixTime, formatUsd } from "../../lib/format";
import { StatusSelect } from "./status-select";

const SEVERITY_VARIANT: Record<DashboardLeak["severity"], "destructive" | "warning" | "secondary"> = {
  critical: "destructive",
  high: "warning",
  medium: "warning",
  low: "secondary",
};

const SEVERITY_RANK: Record<DashboardLeak["severity"], number> = {
  critical: 3,
  high: 2,
  medium: 1,
  low: 0,
};

export function RecoveryQueueTable({ leaks }: { leaks: DashboardLeak[] }) {
  if (leaks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No revenue leaks in the queue yet — run a scan to populate it.
      </p>
    );
  }

  const sorted = [...leaks].sort((a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Revenue Leak</TableHead>
          <TableHead>Monthly Impact</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead>Est. Time</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((leak) => (
          <TableRow key={leak.id}>
            <TableCell className="text-muted-foreground">{leak.category}</TableCell>
            <TableCell className="font-medium">{leak.title}</TableCell>
            <TableCell className="tabular-nums">
              {formatUsd((leak.estimatedImpactLow + leak.estimatedImpactHigh) / 2)}/mo
            </TableCell>
            <TableCell>
              <Badge variant={SEVERITY_VARIANT[leak.severity]} className="capitalize">
                {leak.severity}
              </Badge>
            </TableCell>
            <TableCell className="capitalize">{leak.difficulty ?? "—"}</TableCell>
            <TableCell>{formatFixTime(leak.estimatedFixMinutes)}</TableCell>
            <TableCell>
              <StatusSelect leakId={leak.id} status={leak.recoveryStatus} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
