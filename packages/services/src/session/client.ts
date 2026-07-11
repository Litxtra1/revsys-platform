import { createBrowserClient, createServerClient, type SetAllCookies } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@revsys/database";

/** For use in Client Components. */
export function createBrowserSupabaseClient(
  url: string,
  anonKey: string
): SupabaseClient<Database> {
  return createBrowserClient<Database>(url, anonKey);
}

/**
 * For use in Server Components, Server Actions, and Route Handlers.
 * Cookie writes are wrapped in try/catch because Server Components cannot
 * set cookies — middleware handles session refresh in that case instead.
 *
 * @param cookieDomain Parent domain (e.g. ".revsys.ai") to scope the auth
 * cookie to, so the session is also visible to other subdomains (e.g. the
 * marketing app). Omit for host-only cookies (the correct default in dev).
 */
export async function createServerSupabaseClient(
  url: string,
  anonKey: string,
  cookieDomain?: string
): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    ...(cookieDomain ? { cookieOptions: { domain: cookieDomain } } : {}),
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll: ((cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component; middleware refreshes the session instead.
        }
      }) satisfies SetAllCookies,
    },
  });
}
