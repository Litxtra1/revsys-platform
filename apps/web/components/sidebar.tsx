"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@revsys/ui";
import { LayoutDashboard, HeartPulse, Wrench, Sparkles, Plug, Settings } from "lucide-react";
import type { CategorySummary } from "../lib/dashboard-data";
import { formatUsd } from "../lib/format";

const UTILITY_ITEMS = [
  { label: "Revenue Health", href: "/dashboard/health", icon: HeartPulse },
  { label: "AI Insights", href: "/dashboard/insights", icon: Sparkles },
  { label: "Integrations", href: "/dashboard/integrations", icon: Plug },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const PRIORITY_DOT: Record<CategorySummary["priority"], string> = {
  critical: "bg-coral",
  high: "bg-warning",
  medium: "bg-warning",
  low: "bg-emerald",
  none: "bg-muted-foreground/30",
};

export function Sidebar({ categories }: { categories: CategorySummary[] }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:flex md:flex-col">
      <div className="flex h-16 items-center px-6 text-lg font-semibold">Revsys AI</div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-4">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-fast",
            pathname === "/dashboard"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          Overview
        </Link>

        <div className="mt-4 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Revenue Categories
        </div>
        {categories.map((item) => {
          const href = `/dashboard/category/${encodeURIComponent(item.category)}`;
          const isActive = pathname === href;
          return (
            <Link
              key={item.category}
              href={href}
              className={cn(
                "flex flex-col gap-0.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-fast",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <span className="flex items-center gap-2">
                <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", PRIORITY_DOT[item.priority])} />
                {item.category}
              </span>
              {item.issueCount > 0 ? (
                <span className="pl-3.5 text-xs text-muted-foreground">
                  {item.issueCount} {item.issueCount === 1 ? "issue" : "issues"} · {formatUsd(item.monthlyImpact)}/mo
                </span>
              ) : null}
            </Link>
          );
        })}

        <div className="mt-4 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Manage
        </div>
        {UTILITY_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-fast",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/dashboard/fixes"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-fast",
            pathname === "/dashboard/fixes"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Wrench className="h-4 w-4" />
          Recovery Queue
        </Link>
      </nav>
    </aside>
  );
}
