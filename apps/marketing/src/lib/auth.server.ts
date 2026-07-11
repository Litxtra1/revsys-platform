import { createServerFn } from "@tanstack/react-start";
import { signIn, signOut, signUp } from "@revsys/services/auth";
import { getPublicConfig } from "@revsys/shared";
import { createServerSupabaseClient } from "./supabase-server";

function getClient() {
  const config = getPublicConfig();
  return {
    config,
    client: createServerSupabaseClient(
      config.NEXT_PUBLIC_SUPABASE_URL,
      config.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      config.AUTH_COOKIE_DOMAIN
    ),
  };
}

/**
 * Origin of the Next.js-hosted app that still owns the dashboard, the
 * Supabase email-confirmation callback, and the post-signup "check your
 * email" page — none of which exist in the frozen marketing frontend.
 * In production both apps share AUTH_COOKIE_DOMAIN (e.g. ".revsys.ai"), so
 * the session set here carries over. In dev they're different origins
 * (localhost:8080 vs localhost:3000) and cookies won't cross — expected,
 * not a bug: set AUTH_COOKIE_DOMAIN once real subdomains exist.
 */
function getWebAppOrigin(): string {
  return process.env.WEB_APP_URL ?? "http://localhost:3000";
}

export const signInFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { client } = getClient();
    const { error } = await signIn(client, { email: data.email, password: data.password });
    if (error) return { error: error.message };
    return { redirectUrl: `${getWebAppOrigin()}/dashboard` };
  });

export const signUpFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { client } = getClient();
    const { error } = await signUp(client, {
      email: data.email,
      password: data.password,
      emailRedirectTo: `${getWebAppOrigin()}/auth/confirm`,
    });
    if (error) return { error: error.message };
    return { redirectUrl: `${getWebAppOrigin()}/signup/check-email` };
  });

export const signOutFn = createServerFn({ method: "POST" }).handler(async () => {
  const { client } = getClient();
  await signOut(client);
  return { redirectUrl: "/login" };
});
