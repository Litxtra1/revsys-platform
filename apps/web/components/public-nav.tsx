"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@revsys/ui";
import { ThemeToggle } from "./theme-toggle";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Revenue Scanner", href: "/revenue-scanner" },
  { label: "Products", href: "/products" },
  { label: "Calculator", href: "/calculator" },
  { label: "Pricing", href: "/pricing" },
  { label: "Demo", href: "/demo" },
];

export function PublicNav() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border px-6">
      <Link href="/" className="text-lg font-semibold">
        Revsys AI
      </Link>
      <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-muted-foreground transition-colors duration-fast hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link href="/signup">Get Started</Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu" className="lg:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {NAV_ITEMS.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link href={item.href}>{item.label}</Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem asChild>
              <Link href="/login">Login</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/signup">Get Started</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
