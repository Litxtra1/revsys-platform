import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHero, SectionEyebrow } from "../components/revsys/shared";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Revsys AI" },
      {
        name: "description",
        content:
          "Start free. Move up only when Revsys has already paid for itself. Three tiers — priced against the revenue you recover.",
      },
      { property: "og:title", content: "Pricing — Revsys AI" },
      {
        property: "og:description",
        content:
          "Starter, Growth and Scale — outcomes not feature lists. Start with a free Revenue Scan.",
      },
    ],
  }),
  component: PricingPage,
});

const TIERS = [
  {
    name: "Starter",
    price: "Free",
    pitch: "See where your revenue is going.",
    outcomes: [
      "Full Revenue Scan",
      "Top 3 leaks with dollar impact",
      "One monthly refresh",
      "Sample benchmarks",
    ],
    cta: "Start free scan",
    to: "/scanner" as const,
    featured: false,
  },
  {
    name: "Growth",
    price: "$99",
    cadence: "/ month",
    pitch: "Recover the revenue we find.",
    outcomes: [
      "Everything in Starter",
      "Adaptive Shopping enabled",
      "Weekly scans & Recovery workflows",
      "Slack + email alerts",
    ],
    cta: "Recover revenue",
    to: "/signup" as const,
    featured: true,
  },
  {
    name: "Scale",
    price: "$299",
    cadence: "/ month",
    pitch: "Executive intelligence, on demand.",
    outcomes: [
      "Everything in Growth",
      "Revenue Intelligence with Q&A",
      "Custom benchmarks & cohorts",
      "Dedicated revenue strategist",
    ],
    cta: "Talk to us",
    to: "/signup" as const,
    featured: false,
  },
] as const;

const FAQ_ITEMS = [
  {
    q: "How does Revsys audit my store without installing anything?",
    a: "The initial scan uses only publicly available surface data — your storefront, checkout timing, product pages and category structure. Deeper analysis (traffic, cohorts, cart data) unlocks after you connect Shopify, always read-only.",
  },
  {
    q: "How is this different from Google Analytics or Shopify Reports?",
    a: "GA and Shopify tell you what happened. Revsys tells you why it happened, what it's costing you, and what to fix first — with a dollar figure attached to every recommendation.",
  },
  {
    q: "Will Revsys change anything on my store automatically?",
    a: "No. Revsys is read-only by default. Every recommendation waits for merchant approval. When automated recovery is enabled, you set the guardrails.",
  },
  {
    q: "How accurate are your revenue estimates?",
    a: "Every estimate ships with a confidence score derived from category benchmarks, session volume and telemetry quality. Our median confidence across shipped findings is 94%.",
  },
  {
    q: "Do you work with Shopify Plus?",
    a: "Yes — we're an official Shopify Partner and most of our Scale-tier customers run on Shopify Plus.",
  },
  {
    q: "Can I cancel any time?",
    a: "Yes. Monthly plans cancel at the end of the current cycle. Your last scan and report stay accessible for 30 days.",
  },
];

function PricingPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Pricing"
        title={
          <>
            Priced against the <br className="hidden md:block" />
            revenue you recover.
          </>
        }
        lede="Start free. Move up only when Revsys has already paid for itself."
        align="center"
      />

      <section className="px-6 pb-28 md:pb-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            {TIERS.map((t) => (
              <div
                key={t.name}
                className={
                  "relative flex flex-col rounded-3xl border p-8 transition-all hover:-translate-y-0.5 md:p-10 " +
                  (t.featured
                    ? "border-revenue/40 bg-card shadow-report"
                    : "border-hairline bg-card hover:border-ink-4/40")
                }
              >
                {t.featured ? (
                  <span className="absolute -top-3 left-8 rounded-full bg-revenue px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-revenue-foreground">
                    Most merchants start here
                  </span>
                ) : null}
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-4">{t.name}</div>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-display text-5xl font-semibold tracking-[-0.03em] text-ink-1">
                    {t.price}
                  </span>
                  {"cadence" in t && t.cadence ? <span className="text-sm text-ink-4">{t.cadence}</span> : null}
                </div>
                <p className="mt-3 text-[14px] font-medium text-revenue">{t.pitch}</p>

                <ul className="mt-8 space-y-3 text-[14px] text-ink-2">
                  {t.outcomes.map((o) => (
                    <li key={o} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-growth" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={t.to}
                  className={
                    "mt-10 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[13px] font-semibold transition-all " +
                    (t.featured
                      ? "bg-revenue text-revenue-foreground hover:brightness-110"
                      : "border border-hairline bg-background text-ink-1 hover:border-ink-2")
                  }
                >
                  {t.cta}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ />
    </PageShell>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="border-t border-hairline bg-surface px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <SectionEyebrow>Common questions</SectionEyebrow>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink-1 md:text-[44px]">
            No fluff. <br />
            Just answers.
          </h2>
          <p className="mt-6 max-w-sm text-[14.5px] leading-relaxed text-ink-3">
            Everything merchants ask us before they connect their Shopify store.
          </p>
        </div>
        <div className="divide-y divide-hairline border-y border-hairline">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-[15.5px] font-medium text-ink-1">{item.q}</span>
                  <span
                    aria-hidden
                    className={
                      "grid h-7 w-7 shrink-0 place-items-center rounded-full border border-hairline text-ink-3 transition-all " +
                      (isOpen ? "rotate-45 border-revenue/40 bg-revenue/10 text-revenue" : "")
                    }
                  >
                    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M6 1v10M1 6h10" />
                    </svg>
                  </span>
                </button>
                <div
                  className="grid overflow-hidden transition-all duration-300"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="min-h-0">
                    <p className="pb-6 pr-12 text-[14px] leading-relaxed text-ink-3">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
