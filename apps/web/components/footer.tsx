"use client";

import Link from "next/link";
import { useState } from "react";
import { Linkedin, Twitter } from "lucide-react";
import { Button, Container, Input, Muted } from "@revsys/ui";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Revenue Scanner", href: "/revenue-scanner" },
      { label: "Products", href: "/products" },
      { label: "Revenue Calculator", href: "/calculator" },
      { label: "Pricing", href: "/pricing" },
      { label: "Demo", href: "/demo" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Resources", href: "/resources" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Status", href: "/status" },
      { label: "Partners", href: "/partners" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Security", href: "/legal/security" },
      { label: "Terms", href: "/legal/terms" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(event: React.FormEvent) {
    event.preventDefault();
    if (!email) return;
    setSubscribed(true);
  }

  return (
    <footer className="border-t border-border">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <span className="font-heading text-lg font-semibold">Revsys AI</span>
            <Muted className="max-w-xs">
              We help Shopify merchants find, understand, and recover the revenue their store is
              quietly losing.
            </Muted>
            {subscribed ? (
              <Muted className="text-foreground">
                You&apos;re on the list. We&apos;ll send new revenue benchmarks as they land.
              </Muted>
            ) : (
              <form className="flex max-w-xs gap-2" onSubmit={handleSubscribe}>
                <Input
                  type="email"
                  required
                  placeholder="you@store.com"
                  aria-label="Email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <Button type="submit" variant="outline" className="shrink-0">
                  Subscribe
                </Button>
              </form>
            )}
            <div className="flex items-center gap-3 pt-2">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground"
                title="Coming soon"
                aria-label="X (Twitter), coming soon"
              >
                <Twitter className="h-4 w-4" aria-hidden="true" />
              </span>
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground"
                title="Coming soon"
                aria-label="LinkedIn, coming soon"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title} className="space-y-3">
              <span className="text-sm font-medium text-foreground">{column.title}</span>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors duration-fast hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Revsys AI. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
