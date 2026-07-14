import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { buildShopifyAuthorizeUrl, isValidShopifyDomain, verifyShopifyHmac } from "./index";

describe("isValidShopifyDomain", () => {
  it("accepts a well-formed myshopify.com domain", () => {
    expect(isValidShopifyDomain("my-store.myshopify.com")).toBe(true);
  });

  it("rejects domains that aren't myshopify.com", () => {
    expect(isValidShopifyDomain("my-store.com")).toBe(false);
    expect(isValidShopifyDomain("evil.com/myshopify.com")).toBe(false);
  });

  it("rejects empty or malformed input", () => {
    expect(isValidShopifyDomain("")).toBe(false);
    expect(isValidShopifyDomain(".myshopify.com")).toBe(false);
  });
});

describe("buildShopifyAuthorizeUrl", () => {
  it("includes all required OAuth params", () => {
    const url = buildShopifyAuthorizeUrl({
      shop: "my-store.myshopify.com",
      clientId: "client123",
      redirectUri: "http://localhost:8080/auth/shopify/callback",
      state: "nonce-abc",
    });
    const parsed = new URL(url);
    expect(parsed.origin + parsed.pathname).toBe(
      "https://my-store.myshopify.com/admin/oauth/authorize"
    );
    expect(parsed.searchParams.get("client_id")).toBe("client123");
    expect(parsed.searchParams.get("state")).toBe("nonce-abc");
    expect(parsed.searchParams.get("redirect_uri")).toBe(
      "http://localhost:8080/auth/shopify/callback"
    );
    // Read-only scopes only, per the Sprint 1 brief.
    expect(parsed.searchParams.get("scope")).toBe(
      "read_products,read_collections,read_orders,read_customers,read_themes,read_content,read_files"
    );
  });
});

describe("verifyShopifyHmac", () => {
  const secret = "test-client-secret";

  function sign(params: Record<string, string>): URLSearchParams {
    const message = Object.entries(params)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([k, v]) => `${k}=${v}`)
      .join("&");
    const hmac = createHmac("sha256", secret).update(message).digest("hex");
    return new URLSearchParams({ ...params, hmac });
  }

  it("accepts a correctly signed query", () => {
    const query = sign({ shop: "my-store.myshopify.com", code: "abc123", state: "nonce-abc" });
    expect(verifyShopifyHmac(query, secret)).toBe(true);
  });

  it("rejects a tampered query (param changed after signing)", () => {
    const query = sign({ shop: "my-store.myshopify.com", code: "abc123", state: "nonce-abc" });
    query.set("shop", "attacker-store.myshopify.com");
    expect(verifyShopifyHmac(query, secret)).toBe(false);
  });

  it("rejects when signed with the wrong secret", () => {
    const message = "code=abc123&shop=my-store.myshopify.com&state=nonce-abc";
    const wrongHmac = createHmac("sha256", "wrong-secret").update(message).digest("hex");
    const query = new URLSearchParams({
      shop: "my-store.myshopify.com",
      code: "abc123",
      state: "nonce-abc",
      hmac: wrongHmac,
    });
    expect(verifyShopifyHmac(query, secret)).toBe(false);
  });

  it("rejects a request with no hmac param at all", () => {
    const query = new URLSearchParams({ shop: "my-store.myshopify.com" });
    expect(verifyShopifyHmac(query, secret)).toBe(false);
  });
});
