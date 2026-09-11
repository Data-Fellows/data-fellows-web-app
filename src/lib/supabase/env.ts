// Reads Supabase config lazily (at call time, never at module import) so the
// app builds and runs cleanly before a Supabase project has been connected.
// Every caller must handle a null return -- see SUPABASE_SETUP.md.
export const getSupabaseEnv = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
};
