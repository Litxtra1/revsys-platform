import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionEyebrow } from "../../../components/marketing/shared";

export const metadata: Metadata = {
  title: "Products — Revsys AI",
  description:
    "Four engines. One quiet promise. Adaptive Shopping, Demand Capture, Revenue Recovery and Revenue Intelligence — each closes a different revenue leak.",
  openGraph: {
    title: "Products — Revsys AI",
    description:
      "Four revenue engines carrying Shopify merchants from finding the leak to closing it — no services engagement required.",
  },
};

const ENGINES = [
  {
    n: "01",
    name: "Adaptive Shopping",
    thesis: "Your storefront changes with the buyer.",
    problem: "First-time buyers and returning customers see the same store — and neither converts as well as they could.",
    impact: "~$28k/mo lost to buyers who couldn't find the evidence they needed to say yes.",
    discovery: "Revsys reads intent signals per session and reshapes evidence, layout and offers on the fly — no theme changes.",
    outcome: "Conversion moves from 1.9% to 2.4% within 30 days.",
    delta: "+$28k / mo",
  },
  {
    n: "02",
    name: "Demand Capture",
    thesis: "No sale gets lost to an empty shelf.",
    problem: "Bestsellers sell out. Traffic keeps arriving. Nothing catches the demand.",
    impact: "6-figure recoverable revenue quietly walks off every quarter.",
    discovery: "Revsys detects sold-out demand in real time and generates pre-orders, waitlists and intent-matched substitutes.",
    outcome: "$84k recovered in the first 30 days for a mid-sized apparel brand.",
    delta: "New channel",
  },
  {
    n: "03",
    name: "Revenue Recovery",
    thesis: "Fix the leaks the moment they open.",
    problem: "Checkout regressions, pricing errors and margin drift are discovered days — sometimes weeks — too late.",
    impact: "Weekly firefights and a compounding revenue bill nobody sees.",
    discovery: "Recovery watches checkout, pricing and inventory continuously. Automations route the fix — reviewed where it matters.",
    outcome: "24/7 monitoring. +$14k/mo recovered on average.",
    delta: "+$14k / mo",
  },
  {
    n: "04",
    name: "Revenue Intelligence",
    thesis: "Executive clarity, on demand.",
    problem: "The answers your ops team needs are buried across GA, Shopify, Klaviyo and a Notion doc.",
    impact: "Decisions get delayed. Revenue moves without a witness.",
    discovery: "Ask Revsys — in plain English — why last week softened or which cohort compounds. Consultant-grade answers in seconds.",
    outcome: "Zero dashboards. Zero exports. Zero guesswork.",
    delta: "0 dashboards",
  },
] as const;

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title={
          <>
            Four engines. <br className="hidden md:block" />
            One quiet promise.
          </>
        }
        lede="Each engine takes on a different reason your store leaves money on the table. Together they carry you from finding the leak to closing it — without a services engagement."
        align="center"
      />

      <section className="px-6 pb-28 md:pb-36">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2">
            {ENGINES.map((e) => (
              <article
                key={e.name}
                className="group relative overflow-hidden rounded-3xl border border-hairline bg-card p-8 transition-all hover:-translate-y-0.5 hover:border-revenue/25 hover:shadow-lift md:p-10"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, color-mix(in oklab, var(--growth) 30%, transparent), transparent 70%)",
                  }}
                />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-4">
                      {e.n} · Engine
                    </span>
                    <span className="rounded-full border border-hairline px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-wider text-ink-3">
                      {e.delta}
                    </span>
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-semibold tracking-tight text-ink-1">
                    {e.name}
                  </h3>
                  <p className="mt-2 text-[15px] font-medium text-revenue">{e.thesis}</p>

                  <div className="mt-7 space-y-4 border-t border-hairline pt-6">
                    <EngineStep n="Problem" body={e.problem} />
                    <EngineStep n="Business impact" body={e.impact} tone="critical" />
                    <EngineStep n="How Revsys finds it" body={e.discovery} />
                    <EngineStep n="Outcome" body={e.outcome} tone="growth" />
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 rounded-full bg-revenue px-5 py-3 text-[13px] font-semibold text-revenue-foreground hover:brightness-110"
            >
              See the engines in action →
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-3 text-[13px] font-medium text-ink-1 hover:border-ink-2"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-hairline bg-surface px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <SectionEyebrow>Ready when you are</SectionEyebrow>
          <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.03em] text-ink-1 md:text-[44px]">
            Start with the leak. End with the fix.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-ink-3">
            Every engine ships with the finding, the recommendation, the dollar
            impact and — when you want it — the automation to close it.
          </p>
          <Link
            href="/scanner"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink-1 px-6 py-3 text-[13px] font-semibold text-background hover:-translate-y-px transition-transform"
          >
            Run a free Revenue Scan →
          </Link>
        </div>
      </section>
    </>
  );
}

function EngineStep({ n, body, tone }: { n: string; body: string; tone?: "critical" | "growth" }) {
  const chip = tone === "critical" ? "text-critical" : tone === "growth" ? "text-revenue" : "text-ink-4";
  return (
    <div className="grid grid-cols-[112px_1fr] gap-4">
      <div className={"font-mono text-[10.5px] uppercase tracking-[0.16em] " + chip}>{n}</div>
      <div className="text-[13.5px] leading-relaxed text-ink-2">{body}</div>
    </div>
  );
}
