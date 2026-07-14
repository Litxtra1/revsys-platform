import type { Metadata } from "next";
import { CalculatorPageClient } from "./calculator-page-client";

export const metadata: Metadata = {
  title: "Revenue Opportunity Calculator — Revsys AI",
  description:
    "Model the recoverable revenue hiding inside your Shopify store. Move the sliders. See the opportunity — instantly.",
  openGraph: {
    title: "Revenue Opportunity Calculator — Revsys AI",
    description: "Enter your GMV, sessions and conversion. See what Revsys typically recovers in the first 90 days.",
  },
};

export default function CalculatorPage() {
  return <CalculatorPageClient />;
}
