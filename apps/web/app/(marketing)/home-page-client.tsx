"use client";

import Link from "next/link";
import {
  SectionEyebrow,
  StoreUrlInput,
  CheckDot,
  ShopifyGlyph,
  useReveal,
} from "../../components/marketing/shared";

export function HomePageClient() {
  return (
    <>
      <Hero />
      <LiveTicker />
      <PlatformMap />
      <ProofStrip />
      <FinalCTA />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-24 md:pt-28 md:pb-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--ink-1) 1px, transparent 1px), linear-gradient(to bottom, var(--ink-1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at 50% 20%, black 30%, transparent 78%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--growth) 32%, transparent), transparent 65%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
        <div>
          <div className="revsys-fade-in flex items-center gap-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.22em] text-ink-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-growth/60 revsys-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-growth" />
            </span>
            Revenue Intelligence · for Shopify
          </div>

          <h1 className="revsys-fade-in mt-7 font-display text-[46px] font-semibold leading-[0.98] tracking-[-0.04em] text-ink-1 md:text-[86px]">
            Your store is <br className="hidden md:block" />
            leaking revenue.
            <br className="hidden md:block" />
            <span className="text-growth">We&apos;ll show you where.</span>
          </h1>

          <p className="revsys-fade-in mt-8 max-w-md text-[16px] leading-[1.6] text-ink-3 md:text-[17px]">
            Revsys audits your Shopify store like a senior consultant would —
            and hands you a report you&apos;d normally pay $50,000 for.
          </p>

          <div className="revsys-fade-in mt-10 max-w-xl">
            <StoreUrlInput />
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-4">
              <span className="inline-flex items-center gap-2">
                <CheckDot /> Free audit
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckDot /> No install
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckDot /> Report in 90s
              </span>
            </div>
          </div>

          <div className="revsys-fade-in mt-8 flex flex-wrap gap-3 text-[13px]">
            <Link
              href="/scanner"
              className="inline-flex items-center gap-2 rounded-full border border-hairline bg-card px-4 py-2 font-medium text-ink-1 hover:border-ink-2"
            >
              See how the Scanner works →
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-medium text-ink-3 hover:text-ink-1"
            >
              Explore the four engines
            </Link>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

const SIGNAL_POSITIONS = [
  { top: "14%", left: "64%", delay: "0s" },
  { top: "70%", left: "18%", delay: "0.5s" },
  { top: "36%", left: "84%", delay: "1s" },
  { top: "82%", left: "56%", delay: "1.5s" },
  { top: "22%", left: "22%", delay: "2s" },
] as const;

function HeroVisual() {
  const { ref, shown } = useReveal<HTMLDivElement>(0.2);
  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-[36px] opacity-60 blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, color-mix(in oklab, var(--growth) 30%, transparent), transparent 60%)",
        }}
      />
      <div className="relative overflow-hidden rounded-[24px] border border-hairline bg-card shadow-report">
        <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-critical/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-4">
            revsys / live scan
          </span>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-growth/60 revsys-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-growth" />
          </span>
        </div>

        <div className={"relative flex items-center justify-center py-16 " + (shown ? "revsys-fade-in" : "opacity-0")}>
          <div className="relative grid h-64 w-64 place-items-center">
            <span className="absolute inset-0 rounded-full border border-hairline" />
            <span className="absolute inset-[16%] rounded-full border border-hairline" />
            <span className="absolute inset-[32%] rounded-full border border-hairline" />
            <span
              aria-hidden
              className="revsys-orbit absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--growth) 60%, transparent) 20deg, transparent 70deg)",
                maskImage: "radial-gradient(circle, transparent 47%, black 48%, black 100%)",
                WebkitMaskImage: "radial-gradient(circle, transparent 47%, black 48%, black 100%)",
              }}
            />
            {SIGNAL_POSITIONS.map((s, i) => (
              <span
                key={i}
                aria-hidden
                className="revsys-pulse absolute h-2 w-2 rounded-full bg-growth"
                style={{ top: s.top, left: s.left, animationDelay: s.delay }}
              />
            ))}
            <span className="relative flex h-4 w-4 items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-growth/50 revsys-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-growth" />
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-hairline px-6 py-4">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-4">
            Continuously scanning
          </span>
          <Link href="/scanner" className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-growth">
            See how it works →
          </Link>
        </div>
      </div>
    </div>
  );
}

function LiveTicker() {
  const items = [
    "Nordic Watch Co. · recovered $18,200/mo",
    "Field Notes Co. · recovered $84,000 in 30 days",
    "Pure Athletics · +2.3pt add-to-cart",
    "Northshore Outfitters · $42,800/mo opportunity found",
    "Coastal & Co. · closed 6 revenue leaks",
    "Studio Kin · +$11,900/mo margin recovered",
  ];
  return (
    <section aria-label="Live merchant activity" className="border-y border-hairline bg-surface">
      <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-hidden px-6 py-4">
        <span className="flex shrink-0 items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-4">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-growth/60 revsys-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-growth" />
          </span>
          Live
        </span>
        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex gap-10 whitespace-nowrap" style={{ animation: "revsys-ticker 42s linear infinite" }}>
            {[...items, ...items].map((t, i) => (
              <span key={i} className="font-mono text-[12px] text-ink-3">
                <span className="text-growth">◆</span> {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Platform map — one visual index of every dedicated page */

const PLATFORM = [
  {
    to: "/scanner" as const,
    n: "01",
    name: "Revenue Scanner",
    line: "A business investigation, not a loading bar.",
    body: "Five investigations run in parallel — checkout, product, pricing, demand, margin — and produce a consulting-grade report.",
    cta: "Run the scanner",
  },
  {
    to: "/products" as const,
    n: "02",
    name: "Products",
    line: "Four engines. One quiet promise.",
    body: "Adaptive Shopping, Demand Capture, Revenue Recovery and Revenue Intelligence — each closes a different revenue leak.",
    cta: "Meet the engines",
  },
  {
    to: "/calculator" as const,
    n: "03",
    name: "Revenue Calculator",
    line: "See what's hiding on your storefront.",
    body: "Enter your GMV. Instantly model the recoverable revenue Revsys typically surfaces in the first 90 days.",
    cta: "Model my number",
  },
  {
    to: "/case-studies" as const,
    n: "04",
    name: "Case Studies",
    line: "Real stores. Real outcomes.",
    body: "See what happened when real merchants found their biggest revenue leak — from checkout drop-off to add-to-cart to time-to-insight.",
    cta: "Read the case studies",
  },
  {
    to: "/pricing" as const,
    n: "05",
    name: "Pricing",
    line: "Priced against the revenue you recover.",
    body: "Start free. Move up only when Revsys has already paid for itself. Three tiers, outcomes not features.",
    cta: "See pricing",
  },
] as const;

function PlatformMap() {
  return (
    <section className="px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <SectionEyebrow>The platform</SectionEyebrow>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.04] tracking-[-0.03em] text-ink-1 md:text-[54px]">
            One platform. <br className="hidden md:block" />
            Every stage of revenue.
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-ink-3 md:text-[16px]">
            Revsys is built as a scalable Revenue Intelligence platform, not a
            single tool. Explore each experience on its own dedicated page.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PLATFORM.map((p) => (
            <Link
              key={p.to}
              href={p.to}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-hairline bg-card p-7 transition-all hover:-translate-y-0.5 hover:border-revenue/25 hover:shadow-lift"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(ellipse at center, color-mix(in oklab, var(--growth) 30%, transparent), transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-4">
                    {p.n}
                  </span>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-4 group-hover:text-revenue">
                    Open →
                  </span>
                </div>
                <h3 className="mt-8 font-display text-[22px] font-semibold tracking-tight text-ink-1">
                  {p.name}
                </h3>
                <p className="mt-1.5 text-[14px] font-medium text-revenue">{p.line}</p>
                <p className="mt-4 text-[13.5px] leading-relaxed text-ink-3">{p.body}</p>
                <div className="mt-8 flex items-center gap-2 text-[12.5px] font-medium text-ink-2 group-hover:text-ink-1">
                  {p.cta}
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProofStrip() {
  const items = [
    ["1.2M", "sessions analysed per merchant on average"],
    ["2,400+", "revenue signals mapped to your storefront"],
    ["42", "category benchmarks anchoring every finding"],
    ["94%", "median confidence across findings we ship"],
  ];
  return (
    <section className="border-y border-hairline bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-hairline px-6 md:grid-cols-4 md:divide-x">
        {items.map(([n, label]) => (
          <div key={n} className="px-4 py-10 md:px-8">
            <div className="font-display text-3xl font-semibold tracking-tight text-ink-1 tabular-nums md:text-4xl">
              {n}
            </div>
            <div className="mt-2 max-w-[26ch] text-[12.5px] leading-relaxed text-ink-3">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="px-6 py-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-deep px-8 py-20 text-deep-foreground md:px-16 md:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at 20% 0%, color-mix(in oklab, var(--growth) 30%, transparent), transparent 60%), radial-gradient(ellipse at 100% 100%, color-mix(in oklab, var(--revenue) 40%, transparent), transparent 55%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at 30% 50%, black 30%, transparent 75%)",
          }}
        />
        <div className="relative max-w-2xl">
          <SectionEyebrow tone="growth" onDark>Ready when you are</SectionEyebrow>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] md:text-[64px]">
            Connect your Shopify store. <br />
            Find your first leak in 90 seconds.
          </h2>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-white/65">
            No credit card. No engineering hours. Just the clearest picture of
            your revenue you&apos;ve ever had.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14px] font-semibold text-deep transition-transform hover:-translate-y-px"
            >
              <ShopifyGlyph />
              Connect Shopify
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <Link
              href="/scanner"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-[14px] font-medium text-white/85 transition-colors hover:bg-white/5"
            >
              View a sample report
            </Link>
          </div>
          <p className="mt-8 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/40">
            Shopify Partner · SOC 2 Type II · Read-only by default
          </p>
        </div>
      </div>
    </section>
  );
}
