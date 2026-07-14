import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { buildShopifyAuthorizeUrl, getShopifyConfig, isValidShopifyDomain } from "../../../../lib/shopify.server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const shop = (url.searchParams.get("shop") ?? "").trim().toLowerCase();

  if (!isValidShopifyDomain(shop)) {
    return new NextResponse("Invalid Shopify store domain. Expected format: yourstore.myshopify.com", {
      status: 400,
    });
  }

  const { clientId, redirectUri } = getShopifyConfig();
  const state = crypto.randomUUID();

  const cookieStore = await cookies();
  cookieStore.set("shopify_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  const authorizeUrl = buildShopifyAuthorizeUrl({ shop, clientId, redirectUri, state });
  return NextResponse.redirect(authorizeUrl);
}
