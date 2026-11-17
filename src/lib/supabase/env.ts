// Reads Supabase config lazily (at call time, never at module import) so the
// app builds and runs cleanly before a Supabase project has been connected.
// Every caller must handle a null return -- see SUPABASE_SETUP.md.
//
// The anon key is safe to ship publicly -- Supabase's access control is
// enforced by Row Level Security policies and column-level grants on the
// database (see supabase/migrations/*.sql), not by keeping this key
// secret. These defaults mean local dev and production keep working
// regardless of whether their env vars are set correctly; see the preview
// guard below for the one case where falling back is never safe.
// NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY still take
// precedence when set, so this can be overridden without a code change.
const DEFAULT_SUPABASE_URL = "https://xbuwpiyxpgimnchsfbgr.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhidXdwaXl4cGdpbW5jaHNmYmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxMjc0MjksImV4cCI6MjEwNDcwMzQyOX0._thNhCgmkAU4vekscIe7IgFCleE8BtMcDOyiJM13nxQ";

// Vercel sets this to "preview" for every branch/PR deployment except
// production -- re-exposed under NEXT_PUBLIC_APP_ENV in next.config.ts so
// it's readable from browser-bundled code too, not just the server.
const IS_PREVIEW_DEPLOYMENT = process.env.NEXT_PUBLIC_APP_ENV === "preview";

export const getSupabaseEnv = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && anonKey) {
    return { url, anonKey };
  }

  // Only one of the two was set explicitly -- almost certainly a
  // half-finished override (e.g. a staging URL with no matching key).
  // Never fall back to the production pair in that case: it would
  // silently point a developer's "staging" setup at real production
  // data. Fail the same way "no Supabase connected" is already handled
  // everywhere else, rather than guessing which default to pair it with.
  if (url || anonKey) {
    return null;
  }

  // A preview deployment with no staging credentials set must never
  // silently fall back to the production project -- that would let
  // anyone testing a preview branch read and write real community data.
  // Fail the same way the app already handles "no Supabase connected"
  // everywhere else (empty/"coming soon" states), rather than crashing.
  if (IS_PREVIEW_DEPLOYMENT) {
    return null;
  }

  return { url: DEFAULT_SUPABASE_URL, anonKey: DEFAULT_SUPABASE_ANON_KEY };
};
