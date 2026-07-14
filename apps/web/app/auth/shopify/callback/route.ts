import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import {
  establishShopifySession,
  exchangeShopifyCode,
  fetchShopifyShopInfo,
  getShopifyConfig,
  isValidShopifyDomain,
  linkShopifyStore,
  verifyShopifyHmac,
} from "../../../../lib/shopify.server";

/** Redirects back to /login with a short-lived, JS-readable cookie carrying
 * the error — the login page reads it and clears it. A query param would
 * also work in principle, but a plain server-set cookie is the more reliable
 * channel for surfacing state across this specific redirect. */
async function loginWithError(request: NextRequest, message: string): Promise<NextResponse> {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set("shopify_oauth_error", message, { path: "/", maxAge: 30 });
  return response;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const shop = (url.searchParams.get("shop") ?? "").trim().toLowerCase();
  const code = url.searchParams.get("code") ?? "";
  const state = url.searchParams.get("state") ?? "";

  const cookieStore = await cookies();
  const expectedState = cookieStore.get("shopify_oauth_state")?.value;
  cookieStore.delete("shopify_oauth_state");

  if (!isValidShopifyDomain(shop) || !code || !state || !expectedState || state !== expectedState) {
    return loginWithError(request, "That Shopify connection request looked invalid. Please try again.");
  }

  const { clientSecret } = getShopifyConfig();
  if (!verifyShopifyHmac(url.searchParams, clientSecret)) {
    return loginWithError(request, "Shopify's response couldn't be verified. Please try again.");
  }

  try {
    const { access_token: accessToken, scope } = await exchangeShopifyCode(shop, code);
    const shopInfo = await fetchShopifyShopInfo(shop, accessToken);
    const { client, userId } = await establishShopifySession(shopInfo.email, process.env.AUTH_COOKIE_DOMAIN);
    await linkShopifyStore(client, userId, shopInfo, accessToken, scope);
  } catch (err) {
    console.error("Shopify OAuth callback failed:", err);
    return loginWithError(
      request,
      err instanceof Error ? err.message : "Connecting your Shopify store failed. Please try again."
    );
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
