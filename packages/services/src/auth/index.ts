import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "@revsys/database";

export interface SignUpInput {
  email: string;
  password: string;
  emailRedirectTo: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface RequestPasswordResetInput {
  email: string;
  redirectTo: string;
}

export interface UpdatePasswordInput {
  password: string;
}

export interface AuthResult {
  user: User | null;
  error: { message: string } | null;
}

export async function signUp(
  client: SupabaseClient<Database>,
  input: SignUpInput
): Promise<AuthResult> {
  const { data, error } = await client.auth.signUp({
    email: input.email,
    password: input.password,
    options: { emailRedirectTo: input.emailRedirectTo },
  });
  return { user: data.user, error: error ? { message: error.message } : null };
}

export async function signIn(
  client: SupabaseClient<Database>,
  input: SignInInput
): Promise<AuthResult> {
  const { data, error } = await client.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });
  return { user: data.user, error: error ? { message: error.message } : null };
}

export async function signOut(
  client: SupabaseClient<Database>
): Promise<{ error: { message: string } | null }> {
  const { error } = await client.auth.signOut();
  return { error: error ? { message: error.message } : null };
}

export async function requestPasswordReset(
  client: SupabaseClient<Database>,
  input: RequestPasswordResetInput
): Promise<{ error: { message: string } | null }> {
  const { error } = await client.auth.resetPasswordForEmail(input.email, {
    redirectTo: input.redirectTo,
  });
  return { error: error ? { message: error.message } : null };
}

export async function updatePassword(
  client: SupabaseClient<Database>,
  input: UpdatePasswordInput
): Promise<{ error: { message: string } | null }> {
  const { error } = await client.auth.updateUser({ password: input.password });
  return { error: error ? { message: error.message } : null };
}

export async function getCurrentUser(client: SupabaseClient<Database>): Promise<User | null> {
  const { data, error } = await client.auth.getUser();
  if (error) return null;
  return data.user;
}
