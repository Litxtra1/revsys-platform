/**
 * Server-only Shopify OAuth helpers. Kept out of the main @revsys/shared
 * barrel (own package.json subpath) because this imports node:crypto, which
 * must never end up in a client bundle.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

/** Read-only for now — the Sprint 1 brief for this integration is analysis
 * and recommendations only, not storefront changes. Extend only when a
 * write-capable feature is actually being built. */
export const SHOPIFY_SCOPES = [
  "read_products",
  "read_collections",
  "read_orders",
  "read_customers",
  "read_themes",
  "read_content",
  "read_files",
] as const;

const SHOPIFY_DOMAIN_PATTERN = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/;

export function isValidShopifyDomain(shop: string): boolean {
  return SHOPIFY_DOMAIN_PATTERN.test(shop);
}

export function buildShopifyAuthorizeUrl(input: {
  shop: string;
  clientId: string;
  redirectUri: string;
  state: string;
}): string {
  const params = new URLSearchParams({
    client_id: input.clientId,
    scope: SHOPIFY_SCOPES.join(","),
    redirect_uri: input.redirectUri,
    state: input.state,
  });
  return `https://${input.shop}/admin/oauth/authorize?${params.toString()}`;
}

/**
 * Verifies Shopify's OAuth callback signature: HMAC-SHA256 over all query
 * params (excluding hmac/signature) sorted and joined as key=value&..., keyed
 * with the app's client secret. Without this check, anyone could forge a
 * callback request and get logged in as an arbitrary shop.
 */
export function verifyShopifyHmac(query: URLSearchParams, clientSecret: string): boolean {
  const provided = query.get("hmac");
  if (!provided) return false;

  const message = [...query.entries()]
    .filter(([key]) => key !== "hmac" && key !== "signature")
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const computed = createHmac("sha256", clientSecret).update(message).digest("hex");

  const providedBuf = Buffer.from(provided, "utf8");
  const computedBuf = Buffer.from(computed, "utf8");
  if (providedBuf.length !== computedBuf.length) return false;
  return timingSafeEqual(providedBuf, computedBuf);
}
