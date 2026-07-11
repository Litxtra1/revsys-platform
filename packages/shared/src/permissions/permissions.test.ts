import { describe, expect, it } from "vitest";
import { AuthorizationError } from "../error-handler/index";
import { assertPermission, hasPermission } from "./index";

describe("hasPermission", () => {
  it("grants owner full access", () => {
    expect(hasPermission("owner", "organization:manage")).toBe(true);
    expect(hasPermission("owner", "store:view")).toBe(true);
  });

  it("denies member elevated permissions", () => {
    expect(hasPermission("member", "organization:manage")).toBe(false);
    expect(hasPermission("member", "store:manage")).toBe(false);
  });

  it("allows member the baseline view permission", () => {
    expect(hasPermission("member", "store:view")).toBe(true);
  });
});

describe("assertPermission", () => {
  it("does not throw when the role has permission", () => {
    expect(() => assertPermission("owner", "organization:manage")).not.toThrow();
  });

  it("throws AuthorizationError when the role lacks permission", () => {
    expect(() => assertPermission("member", "organization:manage")).toThrow(AuthorizationError);
  });
});
