import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import type { MockRevenueReport } from "@revsys/engines";
import {
  PageShell,
  PageHero,
  SectionEyebrow,
  StoreUrlInput,
  SeverityChip,
  HealthGauge,
  HealthBar,
  useReveal,
  useCountUp,
} from "../components/revsys/shared";
import { revenueIntelligenceCore } from "../lib/engines";

interface ScannerSearch {
  url?: string;
}

export const Route = createFileRoute("/scanner")({
  validateSearch: (search: Record<string, unknown>): ScannerSearch => ({
    url: typeof search.url === "string" ? search.url : undefined,
  }),
  loaderDeps: ({ search }) => ({ url: search.url }),
  loader: async ({ deps }): Promise<MockRevenueReport | null> => {
    if (!deps.url) return null;
    const result = await revenueIntelligenceCore.dispatch<{ storeUrl: string }, MockRevenueReport>(
      "RevenueScannerEngine",
      { storeUrl: deps.url },
      {}
    );
    return result.status === "success" && result.output ? result.output : null;
  },
  head: () => ({
    meta: [
      { title: "Revenue Scanner — Revsys AI" },
      {
        name: "description",
        content:
          "A business investigation, not a loading bar. Five parallel audits translate every finding into recoverable revenue you can act on today.",
      },
      { property: "og:title", content: "Revenue Scanner — Revsys AI" },
      {
        property: "og:description",
        content:
          "See exactly where your Shopify store is leaking revenue in a consulting-grade report — free, in 90 seconds.",
      },
    ],
  }),
  component: ScannerPage,
});

const SCAN_STEPS = [
  {
    label: "Mapping storefront",
    detail: "Discovering catalog, checkout, pricing surfaces and traffic mix.",
    logs: [
      "→ crawled 342 URLs · 4 collections · 1,204 products",
      "→ resolved theme: Impulse · 12 sections instrumented",
      "→ session baseline established (42-day trailing)",
    ],
  },
  {
    label: "Auditing checkout friction",
    detail: "Measuring latency, form clarity and payment surface hesitation.",
    finding: "Cart abandonment risk",
    logs: [
      "→ mobile shipping calc: 2.4s median (p75 3.1s)",
      "→ 1 payment method hidden behind 'more options'",
      "→ inferred cart drop-off: 34% post-shipping-tap",
    ],
  },
  {
    label: "Inspecting product pages",
    detail: "Reading the evidence buyers use to decide — sizing, reviews, guarantees.",
    finding: "Buyer confidence gap",
    logs: [
      "→ 12 top PDPs missing structured reviews block",
      "→ 8 PDPs missing return / warranty copy above fold",
      "→ image-to-decision ratio 2.1× below category norm",
    ],
  },
  {
    label: "Mapping demand signals",
    detail: "Cross-referencing sold-out SKUs against search intent and paid traffic.",
    finding: "$4,200/mo captured demand",
    logs: [
      "→ 6 SKUs sold out weekly · high organic intent",
      "→ 3 category pages returning empty grids",
      "→ estimated recoverable via waitlist + sub: $4.2k/mo",
    ],
  },
  {
    label: "Estimating recoverable revenue",
    detail: "Weighting every finding against your traffic mix and margin profile.",
    logs: [
      "→ Monte-Carlo simulation (10k runs) complete",
      "→ 30-day recoverable band: $38.4k – $51.2k",
      "→ confidence: 94% · report ready",
    ],
  },
] as const;

function ScannerPage() {
  const report = Route.useLoaderData();
  return (
    <PageShell>
      <PageHero
        eyebrow="The Revenue Scanner"
        title={
          <>
            A business investigation, <br className="hidden md:block" />
            not a loading bar.
          </>
        }
        lede="Every scan runs five investigations in parallel — checkout, product, pricing, demand and margin — and translates each finding into recoverable revenue you can act on today."
        right={
          <div className="max-w-md">
            <StoreUrlInput />
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-4">
              Free · No install · Report in 90 seconds
            </p>
          </div>
        }
      />
      <ScannerTheater />
      <RevenueReport report={report} />
      <MethodologyStrip />
      <ScannerCTA />
    </PageShell>
  );
}

function ScannerTheater() {
  const [active, setActive] = useState(0);
  const [logCursor, setLogCursor] = useState(0);
  const { ref, shown } = useReveal<HTMLDivElement>(0.15);
  const amount = useCountUp(42800, shown, 2400);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % SCAN_STEPS.length), 2400);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    setLogCursor(0);
    const id = setInterval(() => setLogCursor((c) => Math.min(c + 1, SCAN_STEPS[active].logs.length)), 500);
    return () => clearInterval(id);
  }, [active]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-deep px-6 py-24 text-deep-foreground md:py-32"
      style={{ colorScheme: "dark" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[10%] h-[420px] w-[520px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--growth) 40%, transparent), transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <SectionEyebrow tone="growth" onDark>Live investigation</SectionEyebrow>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-[42px]">
            Watch a real scan run — <br className="hidden md:block" />
            step by step.
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <ol className="relative space-y-6">
            <span
              aria-hidden
              className="pointer-events-none absolute left-[15px] top-2 bottom-2 w-px"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--growth) 45%, transparent) 20%, color-mix(in oklab, var(--growth) 45%, transparent) 80%, transparent)",
              }}
            />
            {SCAN_STEPS.map((step, i) => {
              const state: "done" | "active" | "queued" =
                i < active ? "done" : i === active ? "active" : "queued";
              return (
                <li key={step.label} className="relative flex gap-5 pl-1">
                  <div className="relative z-10 mt-0.5">
                    <StepDot state={state} index={i + 1} />
                  </div>
                  <div className={"flex-1 transition-opacity duration-500 " + (state === "queued" ? "opacity-40" : "opacity-100")}>
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <p className="text-[15px] font-medium text-white">{step.label}</p>
                      {state !== "queued" && "finding" in step && step.finding ? (
                        <span className="rounded-full border border-growth/30 bg-growth/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-growth">
                          {step.finding}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-white/55">{step.detail}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-70 revsys-scan-sweep"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--growth) 55%, transparent), transparent)",
                }}
              />
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                  Live investigation
                </span>
                <span className="font-mono text-[10px] tabular-nums text-white/40">SESSION 884-291</span>
              </div>
              <div className="mt-8">
                <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/50">
                  Estimated monthly revenue leak
                </div>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="font-display text-[60px] font-semibold leading-none tracking-[-0.04em] text-white tabular-nums">
                    ${amount.toLocaleString()}
                  </span>
                  <span className="font-mono text-sm text-growth">+ growing</span>
                </div>
                <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-growth transition-[width] duration-700"
                    style={{ width: `${((active + 1) / SCAN_STEPS.length) * 100}%` }}
                  />
                </div>
              </div>
              <div className="mt-8 h-[132px] overflow-hidden rounded-xl border border-white/10 bg-black/25 p-4 font-mono text-[11.5px] leading-relaxed text-white/70">
                {SCAN_STEPS[active].logs.slice(0, logCursor).map((l, i) => (
                  <div key={i} className="revsys-fade-in">
                    <span className="text-white/35">{String(i + 1).padStart(2, "0")}</span>{" "}
                    <span>{l}</span>
                  </div>
                ))}
                {logCursor < SCAN_STEPS[active].logs.length ? (
                  <span className="inline-block h-3 w-1.5 translate-y-0.5 bg-growth revsys-pulse" />
                ) : null}
              </div>
              <div className="mt-6 grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-6">
                <ScanMetric label="Signals" value="2,441" />
                <ScanMetric label="Findings" value={String(Math.min(active + 1, 12))} />
                <ScanMetric label="Confidence" value="94%" tone="growth" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepDot({ state, index }: { state: "done" | "active" | "queued"; index: number }) {
  if (state === "done") {
    return (
      <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-growth text-deep">
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 6.5 L5 9 L9.5 3.5" />
        </svg>
      </span>
    );
  }
  if (state === "active") {
    return (
      <span className="relative grid h-[30px] w-[30px] place-items-center rounded-full border border-growth/60 bg-growth/15 font-mono text-[11px] font-medium text-growth">
        <span aria-hidden className="absolute inset-0 rounded-full border border-growth/40 revsys-ping" />
        {index.toString().padStart(2, "0")}
      </span>
    );
  }
  return (
    <span className="grid h-[30px] w-[30px] place-items-center rounded-full border border-white/15 font-mono text-[11px] text-white/40">
      {index.toString().padStart(2, "0")}
    </span>
  );
}

function ScanMetric({ label, value, tone }: { label: string; value: string; tone?: "growth" }) {
  return (
    <div className="px-4 first:pl-0 last:pr-0">
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">{label}</div>
      <div className={"mt-1 font-display text-lg font-semibold tabular-nums " + (tone === "growth" ? "text-growth" : "text-white")}>
        {value}
      </div>
    </div>
  );
}

const SEVERITY_TONE = { critical: "critical", high: "warning", medium: "warning", low: "growth" } as const;
const SEVERITY_LABEL = { critical: "Critical", high: "High", medium: "Medium", low: "Low" } as const;

function formatUsd(amount: number): string {
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}

function categoryNote(score: number): string {
  if (score >= 75) return "Healthy";
  if (score >= 50) return "Room to grow";
  if (score >= 35) return "Below category";
  return "Underperforming";
}

function RevenueReport({ report }: { report?: MockRevenueReport | null }) {
  const { ref, shown } = useReveal<HTMLDivElement>(0.1);
  const opportunity = useCountUp(report?.revenueEstimate.monthlyOpportunity ?? 42800, shown, 2000);
  const annual = useCountUp((report?.revenueEstimate.monthlyOpportunity ?? 42800) * 12, shown, 2200);

  const topLeaks = report
    ? report.leaks.slice(0, 4).map((leak) => ({
        title: leak.title,
        detail: leak.description,
        sev: SEVERITY_LABEL[leak.severity],
        sevTone: SEVERITY_TONE[leak.severity],
        conf: `${leak.confidence}%`,
        amt: formatUsd((leak.estimatedImpactLow + leak.estimatedImpactHigh) / 2),
      }))
    : [
        { title: "Checkout shipping delay", detail: "2.4s median on mobile — highest-impact single fix", sev: "Critical", sevTone: "critical" as const, conf: "97%", amt: "$18,200" },
        { title: "Missing product evidence", detail: "12 top-selling PDPs lack sizing, reviews or return info", sev: "High", sevTone: "warning" as const, conf: "92%", amt: "$12,400" },
        { title: "Unmet demand on sold-out SKUs", detail: "Search intent exceeds inventory in 3 categories", sev: "Medium", sevTone: "warning" as const, conf: "89%", amt: "$7,900" },
        { title: "Discount stacking overlap", detail: "Accidental combinations quietly erode margin", sev: "Medium", sevTone: "warning" as const, conf: "85%", amt: "$4,300" },
      ];
  const firstLeak = topLeaks[0];

  const growthOpportunities = report
    ? topLeaks.slice(0, 3).map((leak) => [leak.title, `+${leak.amt} / mo`] as const)
    : ([
        ["Waitlist on 6 sold-out SKUs", "+$4,200 / mo"],
        ["Adaptive PDPs for first-time buyers", "+$9,800 / mo"],
        ["Retention flow for one-time purchasers", "+$6,400 / mo"],
      ] as const);

  const healthCategories = report
    ? Object.entries(report.revenueHealth.categoryScores).map(([label, score]) => ({
        label,
        score,
        note: categoryNote(score),
      }))
    : [
        { label: "Checkout", score: 48, note: "Below category" },
        { label: "Product pages", score: 62, note: "Room to grow" },
        { label: "Demand capture", score: 34, note: "Underperforming" },
        { label: "Pricing & margin", score: 78, note: "Healthy" },
      ];

  return (
    <section className="bg-surface px-6 py-28 md:py-36">
      <div ref={ref} className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <SectionEyebrow>The deliverable</SectionEyebrow>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.04] tracking-[-0.03em] text-ink-1 md:text-[54px]">
            A consulting deliverable. <br className="hidden md:block" />
            Not a dashboard.
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-ink-3 md:text-[16px]">
            Every scan produces one document you can walk into a board meeting
            with. Money first. Evidence next. Recommendation last.
          </p>
        </div>

        <article className="overflow-hidden rounded-[28px] border border-hairline bg-card shadow-report">
          <header className="flex flex-wrap items-start justify-between gap-6 border-b border-hairline px-8 pt-8 pb-6 md:px-10 md:pt-10 md:pb-8">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-4">
                Executive summary · Prepared by Revsys AI
              </div>
              <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-1">
                {report?.storeUrl ?? "northshore-outfitters.com"}
              </h3>
              <div className="mt-1 text-[13px] text-ink-3">
                {report
                  ? `Audit ${report.scanId.toUpperCase()} · Generated ${format(new Date(report.generatedAt), "MMM d, yyyy")}`
                  : "Audit REV-9921 · $2.4M annual GMV · 42-day trailing analysis"}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <HealthGauge score={report?.revenueHealth.overallScore ?? 62} />
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-4">
                  Confidence
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-display text-2xl font-semibold text-growth tabular-nums">
                    {report?.confidence ?? 94}%
                  </span>
                  <span className="h-1.5 w-16 overflow-hidden rounded-full bg-hairline">
                    <span className="block h-full bg-growth" style={{ width: `${report?.confidence ?? 94}%` }} />
                  </span>
                </div>
              </div>
            </div>
          </header>

          <div className="grid gap-10 border-b border-hairline px-8 py-10 md:grid-cols-[1.15fr_1fr] md:px-10">
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-4">
                Estimated monthly revenue opportunity
              </div>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-display text-[68px] font-semibold leading-none tracking-[-0.04em] text-ink-1 tabular-nums">
                  ${opportunity.toLocaleString()}
                </span>
                <span className="text-sm font-medium text-success">+12.4%</span>
              </div>
              <div className="mt-3 font-mono text-[12px] text-ink-3">
                ≈ <span className="text-ink-1">${annual.toLocaleString()}</span> annualised · recoverable in 30 days
              </div>
              <p className="mt-6 max-w-md text-[14px] leading-relaxed text-ink-3">
                Based on 1.2M sessions, checkout telemetry and category-matched
                benchmarks. Numbers assume the top three fixes ship in the next
                four weeks.
              </p>
            </div>
            <div className="rounded-2xl border border-hairline bg-surface p-6">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-4">
                Business summary
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
                {report?.businessImpactSummary ?? (
                  <>
                    Northshore is <span className="font-semibold text-ink-1">converting well on desktop</span> but
                    bleeding mobile revenue at checkout. Product pages under-serve
                    first-time buyers, and demand for three top SKUs is going
                    unanswered every week.
                  </>
                )}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-hairline pt-4 text-[12px]">
                <span className="text-ink-4">Fix this first</span>
                <span className="font-mono font-semibold text-revenue">+{firstLeak.amt} / mo</span>
              </div>
            </div>
          </div>

          <div className="border-b border-hairline px-8 py-10 md:px-10">
            <div className="mb-6 flex items-baseline justify-between">
              <div>
                <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-4">Section 01</div>
                <h4 className="mt-1 font-display text-xl font-semibold tracking-tight text-ink-1">
                  Highest priority issues
                </h4>
              </div>
              <span className="font-mono text-[11px] text-ink-4">
                {topLeaks.length} leaks · sorted by {report ? "severity" : "recovery"}
              </span>
            </div>
            <div className="grid grid-cols-[1.8fr_0.55fr_0.55fr_0.7fr] items-center border-b border-hairline pb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-4">
              <div>Revenue leak</div>
              <div>Severity</div>
              <div>Confidence</div>
              <div className="text-right">Recovery / mo</div>
            </div>
            {topLeaks.map((row) => (
              <div
                key={row.title}
                className="group grid grid-cols-[1.8fr_0.55fr_0.55fr_0.7fr] items-center border-b border-hairline py-5 text-[14px] transition-colors last:border-b-0 hover:bg-surface/60"
              >
                <div>
                  <div className="font-medium text-ink-1">{row.title}</div>
                  <div className="mt-0.5 text-[12.5px] text-ink-3">{row.detail}</div>
                </div>
                <div><SeverityChip tone={row.sevTone}>{row.sev}</SeverityChip></div>
                <div className="font-mono text-[13px] text-ink-2 tabular-nums">{row.conf}</div>
                <div className="text-right font-display font-semibold text-revenue tabular-nums">{row.amt}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-0 md:grid-cols-2 md:divide-x md:divide-hairline">
            <div className="px-8 py-10 md:px-10">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-4">
                Section 02 · Recovery opportunities
              </div>
              <h4 className="mt-1 font-display text-xl font-semibold tracking-tight text-ink-1">
                Where growth is hiding
              </h4>
              <ul className="mt-6 space-y-4">
                {growthOpportunities.map(([t, v]) => (
                  <li key={t} className="flex items-center justify-between border-b border-hairline pb-3 last:border-b-0">
                    <span className="text-[14px] text-ink-2">{t}</span>
                    <span className="font-mono text-[13px] font-semibold text-revenue tabular-nums">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-8 py-10 md:px-10">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-4">
                Section 03 · Revenue health
              </div>
              <h4 className="mt-1 font-display text-xl font-semibold tracking-tight text-ink-1">
                Where you stand today
              </h4>
              <div className="mt-6 space-y-4">
                {healthCategories.map(({ label, score, note }) => (
                  <HealthBar key={label} label={label} score={score} note={note} />
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function MethodologyStrip() {
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

function ScannerCTA() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <SectionEyebrow>Run your scan</SectionEyebrow>
        <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-ink-1 md:text-[44px]">
          Your Revenue Report is 90 seconds away.
        </h2>
        <div className="w-full max-w-xl">
          <StoreUrlInput />
        </div>
        <Link to="/pricing" className="text-[13px] font-medium text-ink-3 hover:text-ink-1">
          Or see pricing →
        </Link>
      </div>
    </section>
  );
}
