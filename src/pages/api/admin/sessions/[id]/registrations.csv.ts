import { buildCsv } from "@/lib/api/csv";
import { requireAdmin } from "@/lib/supabase/server";
import type { NextApiRequest, NextApiResponse } from "next";

// Supabase's PostgREST API caps a single response at 1000 rows by
// default (see supabase/migrations/0003_security_fixes.sql for the same
// gotcha on check_ins) -- fetch in pages so a popular session's full
// registrant list makes it into the CSV instead of silently truncating.
const PAGE_SIZE = 1000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { supabase, admin } = await requireAdmin({ req, res });
  if (!supabase || !admin) {
    return res.status(401).json({ error: "Not authorized" });
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid session" });
  }

  const { data: session } = await supabase
    .from("sessions")
    .select("title")
    .eq("id", id)
    .maybeSingle();

  if (!session) {
    return res.status(404).json({ error: "Session not found." });
  }

  const registrations: { name: string; email: string; created_at: string }[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from("session_registrations")
      .select("name, email, created_at")
      .eq("session_id", id)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      return res.status(500).json({ error: "Failed to load registrations." });
    }
    if (!data || data.length === 0) break;
    registrations.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  const rows = registrations.map((row) => [row.name, row.email, row.created_at]);

  const header = ["Name", "Email", "Registered at"];
  const csv = buildCsv([header, ...rows]);

  const slug = session.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${slug || "session"}-registrations.csv"`
  );
  return res.status(200).send(csv);
}
