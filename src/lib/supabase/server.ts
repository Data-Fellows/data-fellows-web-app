import { createServerClient } from "@supabase/ssr";
import { parse, serialize } from "cookie";
import type { IncomingMessage, ServerResponse } from "http";
import { getSupabaseEnv } from "./env";

type ReqRes = {
  req: IncomingMessage & { cookies?: Partial<Record<string, string>> };
  res: ServerResponse;
};

// Server client for API routes and getServerSideProps (Pages Router). Both
// contexts expose the same Node req/res shape. Returns null if the project
// hasn't been connected yet -- callers must handle that case, usually by
// rendering/returning an empty state rather than erroring.
export const createSupabaseServerClient = ({ req, res }: ReqRes) => {
  const env = getSupabaseEnv();
  if (!env) {
    return null;
  }

  const existingSetCookies = () => {
    const header = res.getHeader("Set-Cookie");
    if (!header) return [];
    return Array.isArray(header) ? header.map(String) : [String(header)];
  };

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        const cookies = req.cookies ?? parse(req.headers.cookie ?? "");
        return Object.entries(cookies)
          .filter((entry): entry is [string, string] => entry[1] !== undefined)
          .map(([name, value]) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        const serialized = cookiesToSet.map(({ name, value, options }) =>
          serialize(name, value, options)
        );
        res.setHeader("Set-Cookie", [...existingSetCookies(), ...serialized]);
      },
    },
  });
};

// Admin-only helper: verifies the request's session belongs to a user
// listed in public.admins. Never trust middleware alone for this -- every
// /api/admin/** handler must call this itself.
export const requireAdmin = async ({ req, res }: ReqRes) => {
  const supabase = createSupabaseServerClient({ req, res });
  if (!supabase) {
    return { supabase: null, admin: null };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, admin: null };
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("id, email, full_name")
    .eq("id", user.id)
    .maybeSingle();

  return { supabase, admin };
};
