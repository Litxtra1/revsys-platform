"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { scanStoreAction } from "../../lib/scan-actions";

/* ============================================================
   Revsys AI · Shared chrome + primitives (Book XIII)
   Every marketing route inherits the same navigation, footer,
   motion utilities and consulting-grade design vocabulary.
   ============================================================ */

/* --------- hooks --------- */

export function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, shown };
}

export function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return value;
}

/* --------- brand marks --------- */

export function RevsysMark() {
  return (
    <span className="relative flex h-7 w-7 items-center justify-center rounded-md bg-growth text-deep">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <path d="M5 15 L11 9 L14 12 L19 6" />
        <path d="M15 6 L19 6 L19 10" />
      </svg>
    </span>
  );
}

export function ShopifyGlyph() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M14.2 4.6c-.1 0-.2 0-.3.1l-.6.2c-.4-1-.9-1.9-1.9-1.9h-.1c-.3-.4-.7-.5-1-.5-2.6.1-3.9 3.4-4.3 5l-1.8.6c-.6.2-.6.2-.7.7L2 15.8l7.4 1.4V4.9c-.2 0-.3-.1-.4-.1v-.2c0-.7.1-1.4.3-1.9-.7.3-1.4.9-1.8 2 .4-.1.9-.3 1.4-.4l.5-2.1c-.6.1-1.7.5-2.4 1.6L4.7 4c.5-1.5 1.7-2.7 3.3-2.7.4 0 .8.1 1.1.3.6-.6 1.2-.9 1.9-.9 1.5 0 2.5 1.4 3 3.7l.2.2z" />
    </svg>
  );
}

export function CheckDot() {
  return (
    <span className="grid h-4 w-4 place-items-center rounded-full bg-growth/15 text-growth">
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 6.5 L5 9 L9.5 3.5" />
      </svg>
    </span>
  );
}

/* --------- eyebrow + severity --------- */

export function SectionEyebrow({
  children,
  tone = "revenue",
  onDark = false,
}: {
  children: ReactNode;
  tone?: "revenue" | "growth";
  onDark?: boolean;
}) {
  const color = tone === "growth" || onDark ? "text-growth" : "text-revenue";
  return (
    <div className={"inline-flex items-center gap-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] " + color}>
      <span className="h-px w-6 bg-current opacity-70" />
      {children}
    </div>
  );
}

export function SeverityChip({
  tone,
  children,
}: {
  tone: "critical" | "warning" | "growth";
  children: ReactNode;
}) {
  const map = {
    critical: "text-critical bg-critical/8 border-critical/25",
    warning: "text-warning bg-warning/10 border-warning/25",
    growth: "text-revenue bg-revenue/8 border-revenue/25",
  } as const;
  return (
    <span className={"inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-wider " + map[tone]}>
      {children}
    </span>
  );
}

export function HealthGauge({ score }: { score: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  const tone = score >= 75 ? "text-success" : score >= 50 ? "text-warning" : "text-critical";
  return (
    <div className="relative grid h-[68px] w-[68px] place-items-center">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle cx="32" cy="32" r={r} className="stroke-hairline" strokeWidth="6" fill="none" />
        <circle
          cx="32" cy="32" r={r}
          className={tone}
          stroke="currentColor" strokeWidth="6" fill="none"
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute font-display text-sm font-semibold tabular-nums text-ink-1">{score}</div>
    </div>
  );
}

export function HealthBar({ label, score, note }: { label: string; score: number; note: string }) {
  const tone = score >= 75 ? "bg-success" : score >= 50 ? "bg-warning" : "bg-critical";
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[13px] font-medium text-ink-1">{label}</span>
        <span className="font-mono text-[11px] text-ink-4">{note}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-hairline">
        <div className={"h-full rounded-full " + tone} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

/* --------- store url input (reused on Home + Scanner) --------- */

export function StoreUrlInput() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!value || isPending) return;
          setError(null);
          startTransition(async () => {
            const result = await scanStoreAction(value);
            if (result?.error) setError(result.error);
          });
        }}
        className="group relative flex items-center overflow-hidden rounded-2xl border border-hairline bg-card shadow-lift transition-all focus-within:border-growth/50 focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--growth)_18%,transparent)]"
      >
        <span className="pl-5 pr-2 text-ink-4">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="9" cy="9" r="6" />
            <path d="M14 14l4 4" strokeLinecap="round" />
          </svg>
        </span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="yourstore.com"
          className="flex-1 bg-transparent py-4 pr-3 font-sans text-[15px] text-ink-1 placeholder:text-ink-4 outline-none"
        />
        <button
          type="submit"
          className="m-1.5 inline-flex items-center gap-2 rounded-xl bg-growth px-5 py-3 text-[13px] font-semibold text-deep transition-all hover:brightness-110 disabled:opacity-70"
          disabled={isPending}
        >
          {isPending ? "Scanning…" : "Start free scan"}
          <span aria-hidden>→</span>
        </button>
      </form>
      {error ? <p className="mt-2 text-[12.5px] text-critical">{error}</p> : null}
    </div>
  );
}

/* --------- top navigation (multi-page) --------- */

const NAV_LINKS = [
  { to: "/scanner", label: "Scanner" },
  { to: "/products", label: "Products" },
  { to: "/calculator", label: "Calculator" },
  { to: "/demo", label: "Demo" },
  { to: "/pricing", label: "Pricing" },
] as const;

function ThemeToggle() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("revsys-theme");
      setDark(stored ? stored === "dark" : true);
    } catch {
      setDark(true);
    }
  }, []);
  const toggle = useCallback(() => {
    setDark((d) => {
      const next = !d;
      const r = document.documentElement;
      r.classList.toggle("dark", next);
      r.style.colorScheme = next ? "dark" : "light";
      try {
        localStorage.setItem("revsys-theme", next ? "dark" : "light");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);
  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light" : "Switch to dark"}
      className="grid h-9 w-9 place-items-center rounded-full border border-hairline text-ink-3 transition-all hover:border-ink-2 hover:text-ink-1"
      type="button"
    >
      {dark ? (
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="10" cy="10" r="3.5" />
          <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.5 1.5M14.3 14.3l1.5 1.5M4.2 15.8l1.5-1.5M14.3 5.7l1.5-1.5" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15.5 12.5A6 6 0 0 1 7.5 4.5a6 6 0 1 0 8 8Z" />
        </svg>
      )}
    </button>
  );
}

export function TopNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-50 border-b border-hairline bg-background/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <RevsysMark />
          <span className="font-display text-[17px] font-semibold tracking-tight text-ink-1">
            Revsys<span className="text-growth">.</span>
          </span>
          <span className="ml-2 hidden rounded-full border border-hairline px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.2em] text-ink-4 sm:inline-flex">
            Mission Control
          </span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className={
                "group relative text-[13px] font-medium transition-colors hover:text-ink-1 " +
                (pathname === l.to ? "text-ink-1" : "text-ink-3")
              }
            >
              {l.label}
              <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-growth transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden text-[13px] font-medium text-ink-3 transition-colors hover:text-ink-1 sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-full bg-ink-1 px-4 py-2 text-[13px] font-medium text-background transition-transform hover:-translate-y-px"
          >
            Get started
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-full border border-hairline text-ink-3 md:hidden"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
            </svg>
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-hairline bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                href={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-[14px] font-medium text-ink-2 hover:bg-surface"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-[14px] font-medium text-ink-3 hover:bg-surface"
            >
              Sign in
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  );
}

/* --------- footer --------- */

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: readonly (readonly [string, string])[];
}) {
  return (
    <div>
      <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-4">
        {title}
      </div>
      <ul className="mt-5 space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="text-[13.5px] text-ink-2 hover:text-revenue">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <RevsysMark />
            <span className="font-display text-[17px] font-semibold tracking-tight text-ink-1">
              Revsys<span className="text-growth">.</span>
            </span>
          </div>
          <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-ink-3">
            Revenue Intelligence for Shopify merchants who want to grow with
            confidence, not guesswork.
          </p>
        </div>
        <FooterCol
          title="Platform"
          links={[
            ["Revenue Scanner", "/scanner"],
            ["Products", "/products"],
            ["Calculator", "/calculator"],
            ["Interactive Demo", "/demo"],
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            ["Pricing", "/pricing"],
            ["Sign in", "/login"],
            ["Get started", "/signup"],
          ]}
        />
        <FooterCol
          title="Trust"
          links={[
            ["Methodology", "/scanner"],
            ["Sample report", "/scanner"],
            ["Security", "/scanner"],
          ]}
        />
      </div>
      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-6 text-[12px] text-ink-4 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Revsys AI. Built for merchants who take revenue seriously.</span>
          <span className="font-mono uppercase tracking-[0.16em]">v2.0 · Book XIII</span>
        </div>
      </div>
    </footer>
  );
}

/* --------- page shell --------- */

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-growth/25">
      <TopNav />
      {children}
      <SiteFooter />
    </div>
  );
}

/* --------- page hero (shared vocabulary across every route) --------- */

export function PageHero({
  eyebrow,
  title,
  lede,
  right,
  align = "split",
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  right?: ReactNode;
  align?: "split" | "center";
}) {
  const centered = align === "center" || !right;
  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-20 md:pt-28 md:pb-24">
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
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--growth) 28%, transparent), transparent 65%)",
        }}
      />
      <div
        className={
          "relative mx-auto max-w-7xl " +
          (centered
            ? "flex flex-col items-center text-center"
            : "grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-20")
        }
      >
        <div className={centered ? "max-w-3xl" : ""}>
          <div className="revsys-fade-in">
            <SectionEyebrow>{eyebrow}</SectionEyebrow>
          </div>
          <h1 className="revsys-fade-in mt-6 font-display text-[42px] font-semibold leading-[1.0] tracking-[-0.035em] text-ink-1 md:text-[72px]">
            {title}
          </h1>
          {lede ? (
            <p
              className={
                "revsys-fade-in mt-7 text-[16px] leading-[1.6] text-ink-3 md:text-[17px] " +
                (centered ? "mx-auto max-w-xl" : "max-w-md")
              }
            >
              {lede}
            </p>
          ) : null}
        </div>
        {right && !centered ? <div className="revsys-fade-in">{right}</div> : null}
      </div>
    </section>
  );
}
