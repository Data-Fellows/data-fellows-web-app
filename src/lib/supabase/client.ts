import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

// Browser client for use in client components/hooks. Returns null if the
// project hasn't been connected yet -- callers must handle that case.
export const createSupabaseBrowserClient = () => {
  const env = getSupabaseEnv();
  if (!env) {
    return null;
  }
  return createBrowserClient(env.url, env.anonKey);
};
