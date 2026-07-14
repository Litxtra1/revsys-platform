"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@revsys/ui";
import { RefreshCw } from "lucide-react";
import { runNewScanAction } from "../../lib/dashboard-actions";

export function RunScanButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="flex flex-col items-start gap-1">
      <Button
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await runNewScanAction();
            if (result.error) {
              setError(result.error);
            } else {
              router.refresh();
            }
          });
        }}
      >
        <RefreshCw className={isPending ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
        {isPending ? "Scanning…" : "Run New Scan"}
      </Button>
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </div>
  );
}
