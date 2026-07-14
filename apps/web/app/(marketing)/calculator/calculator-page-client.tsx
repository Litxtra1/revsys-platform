"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { calculateRevenueOpportunity } from "@revsys/engines";
import { PageHero, SectionEyebrow } from "../../../components/marketing/shared";

/**
 * Non-linear breakpoint scales instead of a fixed step: fine-grained near
 * zero (so a brand-new store's real numbers are actually reachable) and
 * progressively wider gaps higher up (so the same slider still reaches
 * large-store numbers without needing thousands of linear steps).
 */
const GMV_BREAKPOINTS = [
  0, 500, 1_000, 2_000, 5_000, 10_000, 20_000, 50_000, 100_000, 200_000, 500_000, 1_000_000,
  2_000_000, 5_000_000, 10_000_000,
];
const SESSIONS_BREAKPOINTS = [
  0, 10, 25, 50, 100, 250, 500, 1_000, 2_500, 5_000, 10_000, 25_000, 50_000, 100_000, 250_000,
  500_000, 1_000_000, 2_000_000,
];
const CONVERSION_BREAKPOINTS = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 6];
const AD_SPEND_BREAKPOINTS = [
  0, 5, 10, 15, 20, 25, 30, 35, 40, 50, 75, 100, 150, 200, 300, 500, 750, 1_000, 1_500, 2_000,
  3_000, 5_000, 7_500, 10_000, 15_000, 20_000, 30_000, 50_000, 75_000, 100_000,
];

function formatGmv(v: number): string {
  if (v < 1_000) return `$${v}`;
  if (v < 1_000_000) return `$${Math.round(v / 1_000)}k`;
  return `$${(v / 1_000_000).toFixed(2)}M`;
}

export function CalculatorPageClient() {
  const [gmv, setGmv] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [conversion, setConversion] = useState(0);
  const [adSpend, setAdSpend] = useState(0);

  const averageOrderValue =
    sessions > 0 && conversion > 0 ? gmv / (sessions * (conversion / 100) * 12) : 0;

  const result = useMemo(
    () =>
      calculateRevenueOpportunity({
        monthlyVisitors: sessions,
        conversionRatePercent: conversion,
        averageOrderValue,
        monthlyAdSpend: adSpend,
      }),
    [sessions, conversion, averageOrderValue, adSpend]
  );

  const monthly = result.potentialRevenueRecovery;
  const annual = monthly * 12;

  return (
    <>
      <PageHero
        eyebrow="Revenue Opportunity Calculator"
        title={
          <>
            Move the sliders. <br className="hidden md:block" />
            See the opportunity.
          </>
        }
        lede="Merchants on Revsys typically recover 8–15% of annual revenue in the first 90 days. Here's what the middle of that range looks like for a store like yours."
        align="center"
      />

      <section className="px-6 pb-28 md:pb-32">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="rounded-[28px] border border-hairline bg-card p-8 shadow-lift md:p-10">
            <SectionEyebrow>Your inputs</SectionEyebrow>
            <div className="mt-8 space-y-8">
              <SliderRow
                label="Annual GMV"
                value={formatGmv(gmv)}
                breakpoints={GMV_BREAKPOINTS}
                v={gmv}
                onChange={setGmv}
                minLabel="$0"
                maxLabel="$10M"
              />
              <SliderRow
                label="Monthly sessions"
                value={sessions.toLocaleString()}
                breakpoints={SESSIONS_BREAKPOINTS}
                v={sessions}
                onChange={setSessions}
                minLabel="0"
                maxLabel="2M"
              />
              <SliderRow
                label="Current conversion rate"
                value={`${conversion.toFixed(2)}%`}
                breakpoints={CONVERSION_BREAKPOINTS}
                v={conversion}
                onChange={setConversion}
                minLabel="0%"
                maxLabel="6%"
              />
              <SliderRow
                label="Monthly ad spend"
                value={`$${adSpend.toLocaleString()}`}
                breakpoints={AD_SPEND_BREAKPOINTS}
                v={adSpend}
                onChange={setAdSpend}
                minLabel="$0"
                maxLabel="$100k"
              />
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-hairline pt-6">
              <MetricSmall label="Current ROAS" value={`${(result.currentRoas ?? 0).toFixed(1)}x`} />
              <MetricSmall
                label="Wasted ad spend / mo"
                value={`$${(result.wastedAdSpend ?? 0).toLocaleString()}`}
                tone="growth"
              />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-hairline bg-card p-10 shadow-report md:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-40 blur-3xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, color-mix(in oklab, var(--growth) 30%, transparent), transparent 65%)",
              }}
            />
            <div className="relative">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-4">
                Estimated recoverable revenue
              </div>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-display text-[68px] font-semibold leading-none tracking-[-0.04em] text-ink-1 tabular-nums">
                  ${monthly.toLocaleString()}
                </span>
                <span className="font-mono text-sm text-growth">/ month</span>
              </div>
              <div className="mt-3 font-mono text-[12px] text-ink-3">
                ≈ <span className="text-ink-1">${annual.toLocaleString()}</span> annualised
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-hairline pt-6 text-[12px]">
                {[
                  ["Checkout", "≈ 42%", Math.round(monthly * 0.42)],
                  ["Product & PDP", "≈ 31%", Math.round(monthly * 0.31)],
                  ["Demand & retention", "≈ 27%", Math.round(monthly * 0.27)],
                ].map(([k, v, dollars]) => (
                  <div key={k as string}>
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-4">{k}</div>
                    <div className="mt-1 font-display text-lg font-semibold text-ink-1 tabular-nums">{v}</div>
                    <div className="mt-0.5 font-mono text-[11px] text-revenue tabular-nums">
                      ${(dollars as number).toLocaleString()}/mo
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-hairline bg-surface p-5 text-[13px] leading-relaxed text-ink-2">
                Range assumes Revsys ships the top three fixes in the first four
                weeks. Confidence rises after connecting your Shopify data.
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/scanner"
                  className="inline-flex items-center gap-2 rounded-full bg-revenue px-5 py-3 text-[13px] font-semibold text-revenue-foreground hover:-translate-y-px transition-transform"
                >
                  Get my real number →
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-3 text-[13px] font-medium text-ink-1 hover:border-ink-2"
                >
                  View pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SliderRow({
  label,
  value,
  breakpoints,
  v,
  onChange,
  minLabel,
  maxLabel,
}: {
  label: string;
  value: string;
  breakpoints: number[];
  v: number;
  onChange: (n: number) => void;
  minLabel: string;
  maxLabel: string;
}) {
  const index = Math.max(0, breakpoints.indexOf(v));
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-4">{label}</span>
        <span className="font-display text-xl font-semibold text-ink-1 tabular-nums">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={breakpoints.length - 1}
        step={1}
        value={index}
        onChange={(e) => onChange(breakpoints[Number(e.target.value)] ?? 0)}
        className="mt-4 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-hairline accent-growth [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-growth [&::-webkit-slider-thumb]:shadow-lift"
      />
      <div className="mt-2 flex justify-between font-mono text-[10.5px] text-ink-4">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

function MetricSmall({ label, value, tone }: { label: string; value: string; tone?: "growth" }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-4">{label}</div>
      <div className={"mt-1 font-display text-2xl font-semibold tabular-nums " + (tone === "growth" ? "text-revenue" : "text-ink-1")}>
        {value}
      </div>
    </div>
  );
}
