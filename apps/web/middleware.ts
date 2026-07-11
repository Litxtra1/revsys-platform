import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@revsys/services/session/middleware";
import { getPublicConfig } from "@revsys/shared";

const PROTECTED_PREFIXES = ["/dashboard"];
const AUTH_PREFIXES = ["/login", "/signup", "/reset-password", "/update-password"];

export async function middleware(request: NextRequest) {
  const config = getPublicConfig();
  const { response, user } = await updateSession(
    request,
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    config.AUTH_COOKIE_DOMAIN
  );

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = AUTH_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!user && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
  // @supabase/supabase-js relies on Node APIs (e.g. process.version) not available on Edge.
  runtime: "nodejs",
};
