import { cn } from "@revsys/ui";

function scoreColorClass(score: number): string {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-destructive";
}

export function RevenueHealthGauge({ score }: { score: number }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={cn("text-6xl font-semibold tabular-nums", scoreColorClass(score))}>
        {score}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Revenue Health Score</p>
    </div>
  );
}
