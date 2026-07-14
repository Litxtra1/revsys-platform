import type { Metadata } from "next";
import { DemoPageClient } from "./demo-page-client";

export const metadata: Metadata = {
  title: "Interactive Demo — Revsys AI",
  description:
    "Pick an engine. See exactly what changed for a real Shopify merchant — checkout, PDPs, demand and revenue intelligence.",
  openGraph: {
    title: "Interactive Demo — Revsys AI",
    description: "Step through real Revsys transformations and watch the exact metric that moved.",
  },
};

export default function DemoPage() {
  return <DemoPageClient />;
}
