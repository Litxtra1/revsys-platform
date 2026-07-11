import { describe, expect, it } from "vitest";
import { ValidationError } from "../error-handler/index";
import { emailSchema, slugSchema, storeUrlSchema, validate } from "./index";

describe("validate", () => {
  it("returns parsed data when valid", () => {
    expect(validate(emailSchema, "merchant@example.com")).toBe("merchant@example.com");
  });

  it("throws a ValidationError with structured issues when invalid", () => {
    expect(() => validate(emailSchema, "not-an-email")).toThrow(ValidationError);
  });
});

describe("slugSchema", () => {
  it("accepts lowercase hyphenated slugs", () => {
    expect(slugSchema.safeParse("revenue-leak-catalog").success).toBe(true);
  });

  it("rejects uppercase or spaced input", () => {
    expect(slugSchema.safeParse("Revenue Leak").success).toBe(false);
  });
});

describe("storeUrlSchema", () => {
  it("accepts a bare domain", () => {
    expect(storeUrlSchema.safeParse("my-store.myshopify.com").success).toBe(true);
  });

  it("accepts a domain with protocol and trailing path", () => {
    expect(storeUrlSchema.safeParse("https://my-store.myshopify.com/").success).toBe(true);
  });

  it("rejects input with no dot (not a valid hostname)", () => {
    expect(storeUrlSchema.safeParse("not-a-url").success).toBe(false);
  });

  it("rejects empty input", () => {
    expect(storeUrlSchema.safeParse("").success).toBe(false);
  });

  it("rejects input containing spaces", () => {
    expect(storeUrlSchema.safeParse("my store.com").success).toBe(false);
  });
});
