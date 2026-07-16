import { createSupabaseClient, type Database } from "@revsys/database";
import { getPublicConfig } from "@revsys/shared";
import { buildShopifyAuthorizeUrl, isValidShopifyDomain, verifyShopifyHmac } from "@revsys/shared/shopify";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@revsys/services";

export { isValidShopifyDomain, verifyShopifyHmac, buildShopifyAuthorizeUrl };

export function getShopifyConfig(): { clientId: string; clientSecret: string; redirectUri: string } {
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("SHOPIFY_CLIENT_ID / SHOPIFY_CLIENT_SECRET are not configured.");
  }
  return {
    clientId,
    clientSecret,
    redirectUri: process.env.SHOPIFY_REDIRECT_URI ?? "http://localhost:3000/auth/shopify/callback",
  };
}

/**
 * Accepts any domain a merchant might type — a custom domain, a bare
 * storefront URL, or an actual *.myshopify.com handle — and resolves it to
 * the handle Shopify OAuth actually requires. Shopify OAuth only ever works
 * against the *.myshopify.com domain, even for stores running on a custom
 * domain, and there's no official reverse-lookup API for arbitrary domains.
 * The practical workaround every third-party Shopify integration uses: fetch
 * the given domain's homepage and look for the myshopify.com handle that
 * Shopify's own theme/analytics boilerplate embeds inline on virtually every
 * storefront. Returns null (not a throw) on any failure — this is a
 * best-effort convenience, not a guarantee, and callers fall back to asking
 * for the handle directly.
 */
export async function detectShopifyDomain(rawInput: string): Promise<string | null> {
  const cleaned = rawInput
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");
  if (!cleaned) return null;
  if (isValidShopifyDomain(cleaned)) return cleaned;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`https://${cleaned}`, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; RevsysBot/1.0; +https://revsys.ai)" },
    });
    clearTimeout(timeout);
    if (!response.ok) return null;

    const html = await response.text();
    const match = html.match(/([a-z0-9][a-z0-9-]*\.myshopify\.com)/i);
    return match ? match[1]!.toLowerCase() : null;
  } catch {
    return null;
  }
}

interface ShopifyTokenResponse {
  access_token: string;
  scope: string;
}

export async function exchangeShopifyCode(shop: string, code: string): Promise<ShopifyTokenResponse> {
  const { clientId, clientSecret } = getShopifyConfig();
  const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });
  if (!response.ok) {
    throw new Error(`Shopify token exchange failed (${response.status}).`);
  }
  return (await response.json()) as ShopifyTokenResponse;
}

export interface ShopifyShopInfo {
  id: number;
  name: string;
  email: string;
  domain: string;
  myshopify_domain: string;
}

export async function fetchShopifyShopInfo(shop: string, accessToken: string): Promise<ShopifyShopInfo> {
  const response = await fetch(`https://${shop}/admin/api/2024-01/shop.json`, {
    headers: { "X-Shopify-Access-Token": accessToken },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch Shopify shop info (${response.status}).`);
  }
  const data = (await response.json()) as { shop: ShopifyShopInfo };
  return data.shop;
}

/**
 * Finds-or-creates a Supabase user for this shop's contact email via the
 * admin API (generateLink auto-creates the user if none exists yet), then
 * verifies that link server-side to establish a real session. Accounts
 * provisioned this way never have a password — there's nothing to sign in
 * with except reconnecting the same Shopify store.
 */
export async function establishShopifySession(
  email: string,
  cookieDomain: string | undefined
): Promise<{ client: SupabaseClient<Database>; userId: string }> {
  const config = getPublicConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }
  const admin = createSupabaseClient(config.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey);

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (linkError || !linkData) {
    throw new Error(linkError?.message ?? "Could not provision a Revsys account for this store.");
  }

  const client = await createServerSupabaseClient(
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    cookieDomain
  );
  const { data: otpData, error: otpError } = await client.auth.verifyOtp({
    type: "magiclink",
    token_hash: linkData.properties.hashed_token,
    email,
  });
  if (otpError || !otpData.user) {
    throw new Error(otpError?.message ?? "Could not sign in to the newly created account.");
  }

  return { client, userId: otpData.user.id };
}

/**
 * Links the connected store to the merchant's organization (created
 * automatically by the handle_new_user trigger on first sign-in). No unique
 * constraint exists on stores(organization_id, domain), so this is a
 * select-then-branch instead of an upsert.
 */
export async function linkShopifyStore(
  client: SupabaseClient<Database>,
  userId: string,
  shopInfo: ShopifyShopInfo,
  accessToken: string,
  scope: string
): Promise<void> {
  // postgrest-js's newer .select()/.insert() string-literal type inference
  // doesn't resolve against this hand-authored Database schema (a pre-existing
  // gap — see apps/web/lib/dashboard-data.ts). Narrow `any` on the query
  // builder only; every result below is still explicitly typed.
  const db = client as unknown as { from: (table: string) => any }; // eslint-disable-line @typescript-eslint/no-explicit-any

  const { data: org, error: orgError } = (await db
    .from("organizations")
    .select("id")
    .eq("owner_id", userId)
    .maybeSingle()) as { data: { id: string } | null; error: { message: string } | null };
  if (orgError || !org) {
    throw new Error(orgError?.message ?? "Could not find an organization for this account.");
  }

  const { data: existingStore } = (await db
    .from("stores")
    .select("id")
    .eq("organization_id", org.id)
    .eq("domain", shopInfo.myshopify_domain)
    .maybeSingle()) as { data: { id: string } | null };

  const storeId = existingStore
    ? existingStore.id
    : await (async () => {
        const { data: inserted, error: insertError } = (await db
          .from("stores")
          .insert({
            organization_id: org.id,
            merchant_id: userId,
            name: shopInfo.name,
            domain: shopInfo.myshopify_domain,
            platform_type: "shopify",
            shopify_connected: true,
            created_by: userId,
          })
          .select("id")
          .single()) as { data: { id: string } | null; error: { message: string } | null };
        if (insertError || !inserted) {
          throw new Error(insertError?.message ?? "Could not create a store record.");
        }
        return inserted.id;
      })();

  if (existingStore) {
    await db.from("stores").update({ shopify_connected: true }).eq("id", storeId);
  }

  const { error: integrationError } = (await db.from("integrations").upsert(
    {
      store_id: storeId,
      provider: "shopify",
      status: "connected",
      connected_at: new Date().toISOString(),
      metadata: { access_token: accessToken, scope },
      created_by: userId,
    },
    { onConflict: "store_id,provider" }
  )) as { error: { message: string } | null };
  if (integrationError) {
    throw new Error(integrationError.message);
  }
}
