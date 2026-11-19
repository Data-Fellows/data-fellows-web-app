import type { SupabaseClient } from "@supabase/supabase-js";

// Durable, DB-backed rate limiting rather than an in-memory counter -- a
// Vercel serverless function has no guaranteed warm instance between
// requests, so an in-memory map would silently reset and stop limiting
// anything. Reusing the enquiries table itself (already durable, already
// has ip_address + created_at) avoids a second store or a new dependency.
//
// This is best-effort, not a security boundary: it limits submissions per
// IP, and a visitor behind a shared/proxied IP (corporate NAT, VPN) can be
// affected by others' traffic. Good enough to blunt casual scripted abuse
// alongside the honeypot field; a dedicated service (Upstash, Cloudflare)
// would be needed for anything stronger.
const WINDOW_MINUTES = 15;
const MAX_PER_WINDOW = 5;

export type RateLimitResult = {
  limited: boolean;
  retryAfterMinutes?: number;
};

export const checkEnquiryRateLimit = async (
  supabase: SupabaseClient,
  ipAddress: string | null
): Promise<RateLimitResult> => {
  // No IP to key off of (e.g. test/local environments) -- don't block, but
  // don't pretend to have rate-limited anything either.
  if (!ipAddress) {
    return { limited: false };
  }

  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("enquiries")
    .select("id", { count: "exact", head: true })
    .eq("ip_address", ipAddress)
    .gte("created_at", windowStart);

  if (error) {
    // Fail open on a counting error -- we'd rather risk an occasional
    // extra submission than lose a legitimate one because the rate-limit
    // check itself broke.
    console.error("[rate-limit] failed to count recent enquiries:", error);
    return { limited: false };
  }

  if ((count ?? 0) >= MAX_PER_WINDOW) {
    return { limited: true, retryAfterMinutes: WINDOW_MINUTES };
  }

  return { limited: false };
};

// Vercel/most proxies set x-forwarded-for as "client, proxy1, proxy2" --
// the first entry is the original client. Falls back to the raw socket
// address for local/non-proxied environments.
export const getClientIp = (req: {
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}): string | null => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  return req.socket?.remoteAddress ?? null;
};
