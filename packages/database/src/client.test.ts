import { describe, expect, it } from "vitest";
import { createSupabaseClient } from "./client";

describe("createSupabaseClient", () => {
  it("returns a client exposing the expected top-level surface", () => {
    const client = createSupabaseClient("https://placeholder.supabase.co", "placeholder-anon-key");

    expect(client.auth).toBeDefined();
    expect(typeof client.from).toBe("function");
  });
});
