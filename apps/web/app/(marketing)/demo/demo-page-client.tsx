"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHero, SectionEyebrow } from "../../../components/marketing/shared";

const DEMO_SCENARIOS = [
  {
    id: "adaptive",
    label: "Adaptive Shopping",
    merchant: "Pure Athletics · Supplements",
    before: "Bestselling supplements had no sizing, no lab info, no reviews. First-time buyers bounced.",
    after: "Adaptive Shopping surfaced the evidence buyers were quietly looking for on each PDP.",
    metricLabel: "Add-to-cart rate",
    metricBefore: "4.1%",
    metricAfter: "6.4%",
    dollar: "+$12,400 / mo",
  },
  {
    id: "demand",
    label: "Demand Capture",
    merchant: "Field Notes Co. · Stationery",
    before: "Top SKUs sold out weekly. Traffic bounced. No signal was captured.",
    after: "Demand Capture turned every sold-out page into a pre-order flow with intent-matched substitutes.",
    metricLabel: "Recovered order value",
    metricBefore: "$0",
    metricAfter: "$84k / mo",
    dollar: "New channel",
  },
  {
    id: "recovery",
    label: "Revenue Recovery",
    merchant: "Nordic Watch Co. · Shopify Plus",
    before: "One in three carts abandoned on mobile after tapping checkout.",
    after: "Revsys detected a shipping-calc delay and rewrote the request path. Checkout now settles in under 900ms.",
    metricLabel: "Mobile checkout completion",
    metricBefore: "62%",
    metricAfter: "81%",
    dollar: "+$18,200 / mo",
  },
  {
    id: "intel",
    label: "Revenue Intelligence",
    merchant: "Studio Kin · DTC Homeware",
    before: "Weekly ops meeting spent 40 minutes reconciling four dashboards.",
    after: "The team asks Revsys questions in Slack and gets consultant-grade answers in seconds.",
    metricLabel: "Time to insight",
    metricBefore: "40 min",
    metricAfter: "6 sec",
    dollar: "Zero dashboards",
  },
] as const;

export function DemoPageClient() {
  const [active, setActive] = useState<(typeof DEMO_SCENARIOS)[number]["id"]>("adaptive");
  const scenario = useMemo(() => DEMO_SCENARIOS.find((s) => s.id === active)!, [active]);
  return (
    <>
      <PageHero
        eyebrow="Interactive Demo"
        title={
          <>
            Pick an engine. <br className="hidden md:block" />
            See what changes.
          </>
        }
        lede="Every merchant leaks revenue somewhere. Step through a real transformation and see the exact metric that moved."
        align="center"
      />

      <section className="px-6 pb-28 md:pb-36">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
            <div className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:gap-2">
              {DEMO_SCENARIOS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={
                    "group flex items-start gap-4 rounded-2xl border px-4 py-4 text-left transition-all " +
                    (s.id === active
                      ? "border-revenue/30 bg-card shadow-lift"
                      : "border-hairline bg-card/60 hover:border-ink-4/40 hover:bg-card")
                  }
                >
                  <span className={"font-mono text-[11px] font-medium tabular-nums " + (s.id === active ? "text-revenue" : "text-ink-4")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className={"block text-[13px] font-semibold " + (s.id === active ? "text-ink-1" : "text-ink-2")}>
                      {s.label}
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] text-ink-3">{s.merchant}</span>
                  </span>
                </button>
              ))}
            </div>

            <div key={scenario.id} className="revsys-fade-in overflow-hidden rounded-3xl border border-hairline bg-card shadow-report">
              <div className="flex items-center justify-between border-b border-hairline px-6 py-3 md:px-8">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-4">
                  {scenario.merchant}
                </span>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-revenue">
                  {scenario.label}
                </span>
              </div>
              <div className="grid gap-0 md:grid-cols-2">
                <div className="border-b border-hairline p-8 md:border-r md:border-b-0 md:p-10">
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-4">Before Revsys</div>
                  <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{scenario.before}</p>
                  <div className="mt-10">
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-4">
                      {scenario.metricLabel}
                    </div>
                    <div className="mt-2 font-display text-4xl font-semibold text-ink-3 tabular-nums line-through decoration-critical/40 decoration-2">
                      {scenario.metricBefore}
                    </div>
                  </div>
                </div>
                <div className="bg-surface p-8 md:p-10">
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-growth">After Revsys</div>
                  <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{scenario.after}</p>
                  <div className="mt-10">
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-4">
                      {scenario.metricLabel}
                    </div>
                    <div className="mt-2 flex items-baseline gap-3">
                      <span className="font-display text-4xl font-semibold text-revenue tabular-nums">
                        {scenario.metricAfter}
                      </span>
                      <span className="font-mono text-[13px] font-medium text-success">{scenario.dollar}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-hairline bg-surface px-6 py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
          <SectionEyebrow>Your turn</SectionEyebrow>
          <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-ink-1 md:text-[44px]">
            The next scenario should be yours.
          </h2>
          <p className="max-w-xl text-[15px] leading-relaxed text-ink-3">
            Run a free Revenue Scan and we&apos;ll show you which of the four engines
            unlocks the largest recoverable number on your store.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/scanner"
              className="inline-flex items-center gap-2 rounded-full bg-revenue px-5 py-3 text-[13px] font-semibold text-revenue-foreground hover:brightness-110"
            >
              Run a free Revenue Scan →
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-3 text-[13px] font-medium text-ink-1 hover:border-ink-2"
            >
              Meet the engines
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
