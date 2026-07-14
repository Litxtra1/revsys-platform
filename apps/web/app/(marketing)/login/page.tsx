import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LoginPageClient } from "./login-page-client";

export const metadata: Metadata = {
  title: "Sign in — Revsys AI",
  description: "Sign in to your Revsys AI Mission Control and open your latest Revenue Report.",
  robots: "noindex",
};

export default async function LoginPage() {
  const cookieStore = await cookies();
  const shopifyError = cookieStore.get("shopify_oauth_error")?.value ?? null;
  return <LoginPageClient shopifyError={shopifyError} />;
}
