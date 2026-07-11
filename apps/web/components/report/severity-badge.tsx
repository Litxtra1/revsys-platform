import { Badge } from "@revsys/ui";
import type { LeakSeverity } from "@revsys/engines";

const SEVERITY_VARIANT: Record<LeakSeverity, "destructive" | "warning" | "secondary" | "outline"> =
  {
    critical: "destructive",
    high: "warning",
    medium: "secondary",
    low: "outline",
  };

const SEVERITY_LABEL: Record<LeakSeverity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function SeverityBadge({ severity }: { severity: LeakSeverity }) {
  return <Badge variant={SEVERITY_VARIANT[severity]}>{SEVERITY_LABEL[severity]}</Badge>;
}
