import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { getCookies, setCookie } from "@tanstack/react-start/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@revsys/database";

/**
 * TanStack Start equivalent of @revsys/services' createServerSupabaseClient,
 * which is built on next/headers and only works inside a Next.js request.
 * Cookie read/write here goes through @tanstack/react-start/server instead.
 *
 * @param cookieDomain Parent domain (e.g. ".revsys.ai") to scope the auth
 * cookie to, so the session is also visible to the dashboard app on its own
 * subdomain. Omit for host-only cookies (the correct default in dev).
 */
export function createServerSupabaseClient(
  url: string,
  anonKey: string,
  cookieDomain?: string
): SupabaseClient<Database> {
  return createServerClient<Database>(url, anonKey, {
    ...(cookieDomain ? { cookieOptions: { domain: cookieDomain } } : {}),
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({ name, value }));
      },
      setAll: ((cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          setCookie(name, value, options);
        });
      }) satisfies SetAllCookies,
    },
  });
}
