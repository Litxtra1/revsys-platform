"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@revsys/ui";
import {
  LayoutDashboard,
  HeartPulse,
  AlertTriangle,
  Wrench,
  Sparkles,
  Plug,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Revenue Health", href: "/dashboard/health", icon: HeartPulse },
  { label: "Revenue Leaks", href: "/dashboard/leaks", icon: AlertTriangle },
  { label: "Revenue Fixes", href: "/dashboard/fixes", icon: Wrench },
  { label: "AI Insights", href: "/dashboard/insights", icon: Sparkles },
  { label: "Integrations", href: "/dashboard/integrations", icon: Plug },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-card md:flex md:flex-col">
      <div className="flex h-16 items-center px-6 text-lg font-semibold">Revsys AI</div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
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
      </nav>
    </aside>
  );
}
