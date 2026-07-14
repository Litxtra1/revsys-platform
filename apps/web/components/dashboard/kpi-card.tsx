import { Card, CardContent, cn } from "@revsys/ui";
import type { LucideIcon } from "lucide-react";

export function KpiCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "default" | "emerald" | "coral" | "warning";
}) {
  return (
    <Card className="p-5">
      <CardContent className="flex items-start justify-between gap-3 p-0">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </div>
          <div
            className={cn(
              "mt-2 font-heading text-2xl font-semibold tabular-nums",
              tone === "emerald" && "text-emerald",
              tone === "coral" && "text-coral",
              tone === "warning" && "text-warning"
            )}
          >
            {value}
          </div>
        </div>
        <div
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
            tone === "emerald" && "bg-emerald/10 text-emerald",
            tone === "coral" && "bg-coral/10 text-coral",
            tone === "warning" && "bg-warning/10 text-warning",
            tone === "default" && "bg-muted text-muted-foreground"
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
}
