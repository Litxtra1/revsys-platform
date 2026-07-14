import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@revsys/services/session/middleware";
import { getPublicConfig } from "@revsys/shared";

export async function middleware(request: NextRequest) {
  const config = getPublicConfig();
  const { response, user } = await updateSession(
    request,
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    config.AUTH_COOKIE_DOMAIN
  );

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
  // @supabase/supabase-js relies on Node APIs (e.g. process.version) not available on Edge.
  runtime: "nodejs",
};
