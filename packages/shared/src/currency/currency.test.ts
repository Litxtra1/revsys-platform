import { describe, expect, it } from "vitest";
import { formatCurrency, parseCurrency } from "./index";

describe("formatCurrency", () => {
  it("formats a number as USD by default", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });

  it("formats using a different currency", () => {
    expect(formatCurrency(1000, { currency: "EUR", locale: "de-DE" })).toContain("1.000");
  });
});

describe("parseCurrency", () => {
  it("parses a formatted currency string back to a number", () => {
    expect(parseCurrency("$1,234.50")).toBe(1234.5);
  });

  it("throws on unparseable input", () => {
    expect(() => parseCurrency("not a number")).toThrow();
  });
});
