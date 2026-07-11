import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@revsys/database";

export interface UpdateSessionResult {
  response: NextResponse;
  user: User | null;
}

/**
 * Refreshes the Supabase session cookie for the current request/response pair.
 * Network failures fail open to "logged out" rather than crashing every request
 * (Manual I Part XIII: graceful degradation).
 *
 * @param cookieDomain Parent domain (e.g. ".revsys.ai") to scope the auth
 * cookie to, so the session is also visible to other subdomains (e.g. the
 * marketing app). Omit for host-only cookies (the correct default in dev).
 */
export async function updateSession(
  request: NextRequest,
  url: string,
  anonKey: string,
  cookieDomain?: string
): Promise<UpdateSessionResult> {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(url, anonKey, {
    ...(cookieDomain ? { cookieOptions: { domain: cookieDomain } } : {}),
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll: ((cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      }) satisfies SetAllCookies,
    },
  });

  let user: User | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  return { response, user };
}
