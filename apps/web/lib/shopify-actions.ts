"use server";

import { detectShopifyDomain } from "./shopify.server";

export async function resolveShopifyDomainAction(
  rawInput: string
): Promise<{ shop: string } | { error: string }> {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { error: "Enter your store's domain to continue." };
  }

  const shop = await detectShopifyDomain(trimmed);
  if (!shop) {
    return {
      error:
        "We couldn't confirm that automatically — enter your exact *.myshopify.com handle instead (check your Shopify admin URL).",
    };
  }

  return { shop };
}
