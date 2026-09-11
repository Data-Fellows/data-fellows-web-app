import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

// Pages that must stay reachable without an existing session -- signing in,
// requesting a reset email, and completing a reset all establish their own
// (temporary, in the reset case) auth state client-side after the page
// loads, so gating them here would strand the user before that can happen.
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

// Gates the /admin area to signed-in users only. This is a session check,
// not an admin-membership check -- every /api/admin/** handler must
// independently verify the user is in public.admins via requireAdmin().
export async function middleware(request: NextRequest) {
  if (PUBLIC_ADMIN_PATHS.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const { supabase, response } = createSupabaseMiddlewareClient(request);

  const redirectToLogin = () => {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  };

  if (!supabase) {
    return redirectToLogin();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirectToLogin();
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
