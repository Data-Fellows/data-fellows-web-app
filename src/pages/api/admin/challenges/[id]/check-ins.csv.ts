import { buildCsv } from "@/lib/api/csv";
import { requireAdmin } from "@/lib/supabase/server";
import type { NextApiRequest, NextApiResponse } from "next";

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
    return res.status(400).json({ error: "Invalid challenge" });
  }

  const { data: challenge } = await supabase
    .from("challenges")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  if (!challenge) {
    return res.status(404).json({ error: "Challenge not found." });
  }

  const checkIns: {
    member_name: string;
    member_email: string;
    learning_note: string | null;
    created_at: string;
    challenge_days: { day_number: number; title: string } | { day_number: number; title: string }[] | null;
  }[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from("check_ins")
      .select(
        "member_name, member_email, learning_note, created_at, challenge_days(day_number, title)"
      )
      .eq("challenge_id", id)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      return res.status(500).json({ error: "Failed to load check-ins." });
    }
    if (!data || data.length === 0) break;
    checkIns.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  const rows = checkIns.map((row) => {
    const day = Array.isArray(row.challenge_days) ? row.challenge_days[0] : row.challenge_days;
    return [
      String(day?.day_number ?? ""),
      day?.title ?? "",
      row.member_name,
      row.member_email,
      row.learning_note ?? "",
      row.created_at,
    ];
  });

  const header = ["Day", "Day title", "Name", "Email", "Learning note", "Checked in at"];
  const csv = buildCsv([header, ...rows]);

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${challenge.slug}-check-ins.csv"`
  );
  return res.status(200).send(csv);
}
