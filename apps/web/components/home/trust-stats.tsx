"use client";

import { useEffect, useState } from "react";
import { Container } from "@revsys/ui";

function useCountUp(target: number, durationMs = 1500): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / durationMs);
      setValue(Math.round(target * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}

interface Stat {
  target: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

const STATS: Stat[] = [
  { target: 4200000, label: "In Revenue Leaks Identified For Shopify Merchants", prefix: "$", suffix: "+" },
  { target: 1800, label: "Shopify Stores Scanned", suffix: "+" },
];

function StatItem({ target, label, prefix = "", suffix = "" }: Stat) {
  const value = useCountUp(target);
  return (
    <div>
      <p className="text-3xl font-semibold tabular-nums">
        {prefix}
        {value.toLocaleString("en-US")}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function TrustStats() {
  return (
    <section className="border-b border-border py-12">
      <Container className="grid gap-8 text-center sm:grid-cols-2">
        {STATS.map((stat) => (
          <StatItem key={stat.label} {...stat} />
        ))}
      </Container>
    </section>
  );
}
