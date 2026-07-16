"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHero, SectionEyebrow } from "../../../components/marketing/shared";

const CASE_STUDIES = [
  {
    id: "adaptive",
    label: "Adaptive Shopping",
    merchant: "Northfield Outdoor Co. · Outdoor Gear",
    quote:
      "\"We didn't realize how many first-time buyers were bouncing because they couldn't find the one detail that would've closed the sale.\" — Head of Ecommerce",
    before:
      "Bestselling jackets had no sizing chart, no fit notes, and no reviews above the fold. First-time buyers looked, hesitated, and left.",
    after:
      "Adaptive Shopping surfaced the exact evidence each visitor was quietly looking for, right on the product page — no theme rebuild required.",
    metricLabel: "Add-to-cart rate",
    metricBefore: "4.1%",
    metricAfter: "6.4%",
    dollar: "+$12,400 / mo",
  },
  {
    id: "demand",
    label: "Demand Capture",
    merchant: "Marrow & Co. · Stationery",
    quote: "\"Every sold-out page used to be a dead end. Now it's where we capture the order.\" — Founder",
    before:
      "Top-selling notebooks sold out most weeks. Traffic kept arriving to an empty page, and every one of those visits simply vanished.",
    after:
      "Demand Capture turned every sold-out page into a pre-order flow with intent-matched substitutes, so the demand never had to disappear.",
    metricLabel: "Recovered order value",
    metricBefore: "$0",
    metricAfter: "$84k / mo",
    dollar: "New channel",
  },
  {
    id: "recovery",
    label: "Revenue Recovery",
    merchant: "Solstice Timepieces · Shopify Plus",
    quote:
      "\"One slow checkout script was quietly costing us a third of our mobile orders — we had no idea until Revsys found it.\" — Operations Lead",
    before:
      "Nearly one in three mobile shoppers abandoned their cart right after tapping checkout, and nobody had traced it back to a single slow request.",
    after:
      "Revsys traced it to a shipping-calculator delay and flagged the fix. Checkout now settles in under 900ms.",
    metricLabel: "Mobile checkout completion",
    metricBefore: "62%",
    metricAfter: "81%",
    dollar: "+$18,200 / mo",
  },
  {
    id: "intel",
    label: "Revenue Intelligence",
    merchant: "Bramwell Home · DTC Homeware",
    quote:
      "\"Our Monday ops meeting used to be 40 minutes of arguing about whose dashboard was right. Now we just ask.\" — COO",
    before:
      "Every ops meeting burned 40 minutes reconciling four different dashboards before anyone could agree on what actually happened last week.",
    after:
      "The team now asks Revsys directly and gets a consultant-grade answer in seconds — no exports, no arguing about whose number is right.",
    metricLabel: "Time to insight",
    metricBefore: "40 min",
    metricAfter: "6 sec",
    dollar: "Zero dashboards",
  },
] as const;

export function CaseStudiesPageClient() {
  const [active, setActive] = useState<(typeof CASE_STUDIES)[number]["id"]>("adaptive");
  const study = useMemo(() => CASE_STUDIES.find((s) => s.id === active)!, [active]);
  return (
    <>
      <PageHero
        eyebrow="Case Studies"
        title={
          <>
            Real stores. <br className="hidden md:block" />
            Real outcomes.
          </>
        }
        lede="Every merchant leaks revenue somewhere. Here's what happened when four of them found out where — and what changed once they fixed it."
        align="center"
      />

      <section className="px-6 pb-28 md:pb-36">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
            <div className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:gap-2">
              {CASE_STUDIES.map((s, i) => (
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

            <div key={study.id} className="revsys-fade-in overflow-hidden rounded-3xl border border-hairline bg-card shadow-report">
              <div className="flex items-center justify-between border-b border-hairline px-6 py-3 md:px-8">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-4">
                  {study.merchant}
                </span>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-revenue">
                  {study.label}
                </span>
              </div>
              <p className="border-b border-hairline px-6 py-6 text-[15px] italic leading-relaxed text-ink-2 md:px-8">
                {study.quote}
              </p>
              <div className="grid gap-0 md:grid-cols-2">
                <div className="border-b border-hairline p-8 md:border-r md:border-b-0 md:p-10">
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-4">Before Revsys</div>
                  <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{study.before}</p>
                  <div className="mt-10">
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-4">
                      {study.metricLabel}
                    </div>
                    <div className="mt-2 font-display text-4xl font-semibold text-ink-3 tabular-nums line-through decoration-critical/40 decoration-2">
                      {study.metricBefore}
                    </div>
                  </div>
                </div>
                <div className="bg-surface p-8 md:p-10">
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-growth">After Revsys</div>
                  <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{study.after}</p>
                  <div className="mt-10">
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-4">
                      {study.metricLabel}
                    </div>
                    <div className="mt-2 flex items-baseline gap-3">
                      <span className="font-display text-4xl font-semibold text-revenue tabular-nums">
                        {study.metricAfter}
                      </span>
                      <span className="font-mono text-[13px] font-medium text-success">{study.dollar}</span>
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
            The next case study should be yours.
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
