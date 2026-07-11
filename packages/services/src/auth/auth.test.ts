import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@revsys/database";
import {
  getCurrentUser,
  requestPasswordReset,
  signIn,
  signOut,
  signUp,
  updatePassword,
} from "./index";

const fakeUser = { id: "11111111-1111-1111-1111-111111111111", email: "merchant@example.com" };

function createMockClient(
  overrides: Partial<Record<string, ReturnType<typeof vi.fn>>> = {}
): SupabaseClient<Database> {
  return {
    auth: {
      signUp: vi.fn().mockResolvedValue({ data: { user: fakeUser, session: null }, error: null }),
      signInWithPassword: vi
        .fn()
        .mockResolvedValue({ data: { user: fakeUser, session: null }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      resetPasswordForEmail: vi.fn().mockResolvedValue({ data: {}, error: null }),
      updateUser: vi.fn().mockResolvedValue({ data: { user: fakeUser }, error: null }),
      getUser: vi.fn().mockResolvedValue({ data: { user: fakeUser }, error: null }),
      ...overrides,
    },
  } as unknown as SupabaseClient<Database>;
}

describe("signUp", () => {
  it("forwards credentials and emailRedirectTo, returning the created user", async () => {
    const client = createMockClient();

    const result = await signUp(client, {
      email: "merchant@example.com",
      password: "hunter22",
      emailRedirectTo: "https://app.revsys.ai/auth/confirm",
    });

    expect(client.auth.signUp).toHaveBeenCalledWith({
      email: "merchant@example.com",
      password: "hunter22",
      options: { emailRedirectTo: "https://app.revsys.ai/auth/confirm" },
    });
    expect(result).toEqual({ user: fakeUser, error: null });
  });

  it("normalizes a Supabase error into { message }", async () => {
    const client = createMockClient({
      signUp: vi.fn().mockResolvedValue({
        data: { user: null, session: null },
        error: { message: "Email already registered" },
      }),
    });

    const result = await signUp(client, {
      email: "merchant@example.com",
      password: "hunter22",
      emailRedirectTo: "https://app.revsys.ai/auth/confirm",
    });

    expect(result).toEqual({ user: null, error: { message: "Email already registered" } });
  });
});

describe("signIn", () => {
  it("calls signInWithPassword and returns the session user", async () => {
    const client = createMockClient();
    const result = await signIn(client, { email: "merchant@example.com", password: "hunter22" });
    expect(client.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "merchant@example.com",
      password: "hunter22",
    });
    expect(result.user).toEqual(fakeUser);
  });
});

describe("signOut", () => {
  it("returns no error on success", async () => {
    const client = createMockClient();
    expect(await signOut(client)).toEqual({ error: null });
  });
});

describe("requestPasswordReset", () => {
  it("forwards the redirect URL", async () => {
    const client = createMockClient();
    await requestPasswordReset(client, {
      email: "merchant@example.com",
      redirectTo: "https://app.revsys.ai/auth/confirm?next=/update-password",
    });
    expect(client.auth.resetPasswordForEmail).toHaveBeenCalledWith("merchant@example.com", {
      redirectTo: "https://app.revsys.ai/auth/confirm?next=/update-password",
    });
  });
});

describe("updatePassword", () => {
  it("calls updateUser with the new password", async () => {
    const client = createMockClient();
    await updatePassword(client, { password: "newHunter22" });
    expect(client.auth.updateUser).toHaveBeenCalledWith({ password: "newHunter22" });
  });
});

describe("getCurrentUser", () => {
  it("returns the user when present", async () => {
    const client = createMockClient();
    expect(await getCurrentUser(client)).toEqual(fakeUser);
  });

  it("returns null when Supabase reports an error", async () => {
    const client = createMockClient({
      getUser: vi
        .fn()
        .mockResolvedValue({ data: { user: null }, error: { message: "no session" } }),
    });
    expect(await getCurrentUser(client)).toBeNull();
  });
});
