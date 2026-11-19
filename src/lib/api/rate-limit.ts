// Rate limiting for /api/contact lives in the submit_enquiry Postgres
// function (migration 0014_enquiry_rpc_functions.sql), not here -- the
// anon-key client this route runs as has no SELECT on public.enquiries
// (see 0012_enquiries.sql's RLS policy), so counting recent submissions
// has to happen inside a SECURITY DEFINER function, atomically with the
// insert itself (which also closes the check-then-insert race a
// separate query would have). This file just extracts the request IP,
// which both that RPC call and abuse review need.

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
