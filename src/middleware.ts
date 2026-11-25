import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard admin routes; skip if Supabase isn't configured yet.
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (!hasSupabasePublicEnv()) {
    // Allow the page to render a helpful setup message.
    return NextResponse.next();
  }

  const response = await updateSession(request);

  // Let the login page through
  if (pathname.startsWith("/admin/login")) {
    return response;
  }

  // Check auth by reading user from a lightweight request-scoped supabase client
  // updateSession already refreshed cookies; we verify by checking the supabase auth cookie presence
  // and do a full check in the admin layout/server pages.
  const hasAuthCookie = request.cookies.getAll().some(
    (c) => c.name.includes("-auth-token") || c.name.startsWith("sb-"),
  );

  if (!hasAuthCookie) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
