"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Spinner, cn } from "@revsys/ui";

export interface ScanStage {
  label: string;
  description: string;
}

export const DEFAULT_SCAN_STAGES: ScanStage[] = [
  {
    label: "Connecting to Store",
    description: "Locating your storefront and confirming it's reachable.",
  },
  {
    label: "Validating Store Information",
    description: "Confirming the store URL and basic storefront details.",
  },
  {
    label: "Reviewing Store Structure",
    description: "Mapping navigation, collections, and page layout.",
  },
  {
    label: "Checking Product Experience",
    description: "Looking at product pages, pricing, and messaging.",
  },
  {
    label: "Looking for Revenue Leaks",
    description: "Comparing your store against proven revenue benchmarks.",
  },
  {
    label: "Estimating Revenue Opportunities",
    description: "Calculating potential impact for each finding.",
  },
  {
    label: "Preparing Revenue Report",
    description: "Putting together your prioritized results.",
  },
];

export interface ScanExperienceProps {
  stages?: ScanStage[];
  onComplete?: () => void;
  stageDurationMs?: number;
}

export function ScanExperience({
  stages = DEFAULT_SCAN_STAGES,
  onComplete,
  stageDurationMs = 1100,
}: ScanExperienceProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= stages.length) {
      onComplete?.();
      return undefined;
    }
    const timer = setTimeout(() => setActiveIndex((index) => index + 1), stageDurationMs);
    return () => clearTimeout(timer);
    // onComplete intentionally excluded — stable enough for this purpose and
    // re-including it would re-trigger the timer on every parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, stages.length, stageDurationMs]);

  const remainingStages = Math.max(0, stages.length - activeIndex);
  const secondsRemaining = Math.max(1, Math.ceil((remainingStages * stageDurationMs) / 1000));
  const progressPercent = Math.round((Math.min(activeIndex, stages.length) / stages.length) * 100);

  return (
    <div className="w-full space-y-6" role="status" aria-live="polite">
      <div className="space-y-2">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-standard"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-right text-xs text-muted-foreground">
          {activeIndex < stages.length ? `About ${secondsRemaining}s remaining` : "Finishing up…"}
        </p>
      </div>

      <ul className="space-y-4">
        {stages.map((stage, index) => {
          const isDone = index < activeIndex;
          const isActive = index === activeIndex;
          return (
            <li key={stage.label} className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border",
                  isDone && "border-transparent bg-primary text-primary-foreground",
                  isActive && "border-primary"
                )}
              >
                {isDone ? (
                  <Check className="h-3.5 w-3.5" />
                ) : isActive ? (
                  <Spinner size={12} />
                ) : null}
              </span>
              <div>
                <p
                  className={cn(
                    "text-sm font-medium",
                    isDone || isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {stage.label}
                </p>
                {isActive ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">{stage.description}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
