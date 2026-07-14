"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient, signIn, signOut, signUp } from "@revsys/services";
import { getPublicConfig } from "@revsys/shared";

async function getClient() {
  const config = getPublicConfig();
  return createServerSupabaseClient(
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    config.AUTH_COOKIE_DOMAIN
  );
}

export async function signOutAction(): Promise<void> {
  const client = await getClient();
  await signOut(client);
  redirect("/login");
}

export async function signInAction(email: string, password: string): Promise<{ error?: string }> {
  const client = await getClient();
  const { error } = await signIn(client, { email, password });
  if (error) return { error: error.message };
  redirect("/dashboard");
}

export async function signUpAction(email: string, password: string): Promise<{ error?: string }> {
  const config = getPublicConfig();
  const client = await getClient();
  const { error } = await signUp(client, {
    email,
    password,
    emailRedirectTo: `${config.NEXT_PUBLIC_APP_URL}/auth/confirm`,
  });
  if (error) return { error: error.message };
  return {};
}
