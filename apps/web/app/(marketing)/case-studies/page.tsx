import type { Metadata } from "next";
import { CaseStudiesPageClient } from "./case-studies-page-client";

export const metadata: Metadata = {
  title: "Case Studies — Revsys AI",
  description:
    "Real stores, real outcomes. See exactly what changed for merchants who found and fixed their biggest revenue leak.",
  openGraph: {
    title: "Case Studies — Revsys AI",
    description: "See what happened when real merchants found their biggest revenue leak — and fixed it.",
  },
};

export default function CaseStudiesPage() {
  return <CaseStudiesPageClient />;
}
