"use server";

import { redirect } from "next/navigation";
import {
  createServerSupabaseClient,
  signUp,
  signIn,
  signOut,
  requestPasswordReset,
  updatePassword,
} from "@revsys/services";
import { getPublicConfig } from "@revsys/shared";

export interface AuthActionState {
  error?: string;
}

async function getClient() {
  const config = getPublicConfig();
  return {
    config,
    client: await createServerSupabaseClient(
      config.NEXT_PUBLIC_SUPABASE_URL,
      config.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      config.AUTH_COOKIE_DOMAIN
    ),
  };
}

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const { config, client } = await getClient();

  const { error } = await signUp(client, {
    email,
    password,
    emailRedirectTo: `${config.NEXT_PUBLIC_APP_URL}/auth/confirm`,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/signup/check-email");
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const { client } = await getClient();

  const { error } = await signIn(client, { email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signOutAction(): Promise<void> {
  const { client } = await getClient();
  await signOut(client);
  redirect("/login");
}

export async function requestPasswordResetAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const { config, client } = await getClient();

  const { error } = await requestPasswordReset(client, {
    email,
    redirectTo: `${config.NEXT_PUBLIC_APP_URL}/auth/confirm?next=/update-password`,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/reset-password/check-email");
}

export async function updatePasswordAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");
  const { client } = await getClient();

  const { error } = await updatePassword(client, { password });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}
