import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

// Gates the /admin area to signed-in users only. This is a session check,
// not an admin-membership check -- every /api/admin/** handler must
// independently verify the user is in public.admins via requireAdmin().
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
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
