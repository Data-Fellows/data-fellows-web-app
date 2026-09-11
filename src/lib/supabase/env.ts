// Reads Supabase config lazily (at call time, never at module import) so the
// app builds and runs cleanly before a Supabase project has been connected.
// Every caller must handle a null return -- see SUPABASE_SETUP.md.
//
// The anon key is safe to ship publicly -- Supabase's access control is
// enforced by Row Level Security policies and column-level grants on the
// database (see supabase/migrations/*.sql), not by keeping this key
// secret. These defaults mean the site keeps working regardless of which
// Vercel project/environment builds it, or whether its env vars are set
// correctly there; NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
// still take precedence when set, so this can be overridden without a
// code change.
const DEFAULT_SUPABASE_URL = "https://xbuwpiyxpgimnchsfbgr.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhidXdwaXl4cGdpbW5jaHNmYmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxMjc0MjksImV4cCI6MjEwNDcwMzQyOX0._thNhCgmkAU4vekscIe7IgFCleE8BtMcDOyiJM13nxQ";

export const getSupabaseEnv = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
};
