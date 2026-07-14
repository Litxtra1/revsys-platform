"use client";

import { useTransition } from "react";
import { updateLeakStatusAction } from "../../lib/dashboard-actions";
import type { DashboardLeak } from "../../lib/dashboard-data";

const STATUS_OPTIONS: { value: DashboardLeak["recoveryStatus"]; label: string }[] = [
  { value: "unaddressed", label: "Unaddressed" },
  { value: "in_progress", label: "In Progress" },
  { value: "recovered", label: "Recovered" },
  { value: "dismissed", label: "Dismissed" },
];

export function StatusSelect({
  leakId,
  status,
}: {
  leakId: string;
  status: DashboardLeak["recoveryStatus"];
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(event) => {
        const next = event.target.value as DashboardLeak["recoveryStatus"];
        startTransition(() => {
          void updateLeakStatusAction(leakId, next);
        });
      }}
      className="h-8 rounded-md border border-border bg-background px-2 text-xs font-medium disabled:opacity-60"
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
