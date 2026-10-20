import { requireAdmin } from "@/lib/supabase/server";
import type { NextApiRequest, NextApiResponse } from "next";

const csvEscape = (value: string) => `"${value.replace(/"/g, '""')}"`;

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

  const { data: registrations, error } = await supabase
    .from("session_registrations")
    .select("name, email, created_at")
    .eq("session_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    return res.status(500).json({ error: "Failed to load registrations." });
  }

  const rows = (registrations ?? []).map((row) => [
    row.name,
    row.email,
    row.created_at,
  ]);

  const header = ["Name", "Email", "Registered at"];
  const csv = [header, ...rows]
    .map((cols) => cols.map((col) => csvEscape(String(col))).join(","))
    .join("\n");

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
