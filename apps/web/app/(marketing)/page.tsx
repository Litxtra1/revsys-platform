import type { Metadata } from "next";
import { HomePageClient } from "./home-page-client";

export const metadata: Metadata = {
  title: "Revsys AI — Revenue Intelligence for Shopify merchants",
  description:
    "See exactly where your Shopify store is leaking revenue — and the fastest fixes to recover it. Free scan in 90 seconds.",
};

export default function HomePage() {
  return <HomePageClient />;
}
