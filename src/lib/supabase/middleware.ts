import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseEnv } from "./env";

// Separate from server.ts because Next middleware runs on the Edge runtime
// with NextRequest/NextResponse, not the Node req/res shape API routes and
// getServerSideProps use.
export const createSupabaseMiddlewareClient = (request: NextRequest) => {
  const env = getSupabaseEnv();
  let response = NextResponse.next({ request });

  if (!env) {
    return { supabase: null, response };
  }

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  return { supabase, response };
};
