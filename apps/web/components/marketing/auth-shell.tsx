"use client";

import { useState, type ReactNode } from "react";
import { RevsysMark } from "./shared";

export function AuthShell({
  eyebrow,
  title,
  lede,
  submitLabel,
  footer,
  showStore = false,
  notice,
  initialError,
  onSubmit,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  submitLabel: string;
  footer: ReactNode;
  showStore?: boolean;
  notice?: string | undefined;
  initialError?: string | null;
  onSubmit: (input: { email: string; password: string; store: string }) => Promise<{ error?: string } | void>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [store, setStore] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);

  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--growth) 28%, transparent), transparent 65%)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-revenue">
            <span className="h-px w-6 bg-current opacity-70" />
            {eyebrow}
          </div>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-[-0.035em] text-ink-1 md:text-[56px]">
            {title}
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-3">{lede}</p>

          <div className="mt-10 hidden max-w-md space-y-4 lg:block">
            {[
              "Consulting-grade Revenue Reports on demand.",
              "Adaptive Shopping, Demand Capture & Recovery.",
              "Read-only by default. SOC 2 Type II.",
            ].map((line) => (
              <div key={line} className="flex items-start gap-3 text-[13.5px] text-ink-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-growth" />
                {line}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-[24px] border border-hairline bg-card p-8 shadow-report md:p-10">
            <div className="flex items-center gap-2.5">
              <RevsysMark />
              <span className="font-display text-[15px] font-semibold text-ink-1">
                Revsys<span className="text-growth">.</span>
              </span>
            </div>
            {notice ? <p className="mt-4 text-[12.5px] text-growth">{notice}</p> : null}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (submitting) return;
                setSubmitting(true);
                setError(null);
                onSubmit({ email, password, store })
                  .then((result) => {
                    if (result?.error) setError(result.error);
                  })
                  .finally(() => setSubmitting(false));
              }}
              className="mt-8 space-y-4"
            >
              {showStore ? (
                <Field
                  label="Your Shopify store"
                  type="text"
                  placeholder="yourstore.myshopify.com"
                  value={store}
                  onChange={setStore}
                />
              ) : null}
              <Field
                label="Work email"
                type="email"
                placeholder="you@yourstore.com"
                value={email}
                onChange={setEmail}
              />
              <Field
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={setPassword}
              />
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-revenue px-5 py-3 text-[13.5px] font-semibold text-revenue-foreground transition-all hover:brightness-110 disabled:opacity-70"
              >
                {submitLabel}
                <span aria-hidden>→</span>
              </button>
              {error ? <p className="text-[12.5px] text-critical">{error}</p> : null}

              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-hairline" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-4">
                    or
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const raw =
                    store.trim() ||
                    window.prompt("Your Shopify store domain (e.g. yourstore.myshopify.com)") ||
                    "";
                  const cleaned = raw
                    .trim()
                    .toLowerCase()
                    .replace(/^https?:\/\//, "")
                    .replace(/\/$/, "");
                  if (!cleaned) return;
                  const shop = cleaned.endsWith(".myshopify.com") ? cleaned : `${cleaned}.myshopify.com`;
                  window.location.href = `/auth/shopify/start?shop=${encodeURIComponent(shop)}`;
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-hairline bg-background px-5 py-3 text-[13.5px] font-medium text-ink-1 transition-all hover:border-ink-2"
              >
                <ShopifyGlyphSmall />
                Continue with Shopify
              </button>
            </form>

            <p className="mt-8 border-t border-hairline pt-5 text-[12.5px] text-ink-3">{footer}</p>
          </div>
          <p className="mt-4 text-center font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-4">
            Shopify Partner · SOC 2 Type II · Read-only by default
          </p>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-4">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 block w-full rounded-xl border border-hairline bg-background px-4 py-3 text-[14px] text-ink-1 placeholder:text-ink-4 outline-none transition-all focus:border-growth/50 focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--growth)_18%,transparent)]"
      />
    </label>
  );
}

function ShopifyGlyphSmall() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-growth" fill="currentColor" aria-hidden>
      <path d="M14.2 4.6c-.1 0-.2 0-.3.1l-.6.2c-.4-1-.9-1.9-1.9-1.9h-.1c-.3-.4-.7-.5-1-.5-2.6.1-3.9 3.4-4.3 5l-1.8.6c-.6.2-.6.2-.7.7L2 15.8l7.4 1.4V4.9c-.2 0-.3-.1-.4-.1v-.2c0-.7.1-1.4.3-1.9-.7.3-1.4.9-1.8 2 .4-.1.9-.3 1.4-.4l.5-2.1c-.6.1-1.7.5-2.4 1.6L4.7 4c.5-1.5 1.7-2.7 3.3-2.7.4 0 .8.1 1.1.3.6-.6 1.2-.9 1.9-.9 1.5 0 2.5 1.4 3 3.7l.2.2z" />
    </svg>
  );
}
