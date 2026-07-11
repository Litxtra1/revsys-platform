import { describe, expect, it } from "vitest";
import { formatDate, isValidDate } from "./index";

describe("formatDate", () => {
  it("formats a Date using the default pattern", () => {
    expect(formatDate(new Date(2026, 0, 15))).toBe("Jan 15, 2026");
  });

  it("formats an ISO date string", () => {
    expect(formatDate("2026-06-01T00:00:00")).toBe("Jun 1, 2026");
  });

  it("accepts a custom pattern", () => {
    expect(formatDate(new Date(2026, 0, 15), "yyyy-MM-dd")).toBe("2026-01-15");
  });
});

describe("isValidDate", () => {
  it("returns true for a valid Date instance", () => {
    expect(isValidDate(new Date())).toBe(true);
  });

  it("returns false for an invalid Date instance", () => {
    expect(isValidDate(new Date("not-a-date"))).toBe(false);
  });

  it("returns false for non-Date values", () => {
    expect(isValidDate("2026-01-15")).toBe(false);
    expect(isValidDate(null)).toBe(false);
  });
});
