import type { Metadata } from "next";
import { SignupPageClient } from "./signup-page-client";

export const metadata: Metadata = {
  title: "Get started — Revsys AI",
  description:
    "Create your Revsys Mission Control and get your first Revenue Report in 90 seconds. Free — no credit card, no install.",
  openGraph: {
    title: "Get started — Revsys AI",
    description: "Connect your Shopify store and see exactly where your revenue is leaking. Free.",
  },
};

export default function SignupPage() {
  return <SignupPageClient />;
}
