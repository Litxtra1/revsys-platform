import type { Metadata } from "next";
import { PricingPageClient } from "./pricing-page-client";

export const metadata: Metadata = {
  title: "Pricing — Revsys AI",
  description:
    "Start free. Move up only when Revsys has already paid for itself. Three tiers — priced against the revenue you recover.",
  openGraph: {
    title: "Pricing — Revsys AI",
    description: "Starter, Growth and Scale — outcomes not feature lists. Start with a free Revenue Scan.",
  },
};

export default function PricingPage() {
  return <PricingPageClient />;
}
