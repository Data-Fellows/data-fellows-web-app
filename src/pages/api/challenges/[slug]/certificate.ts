import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { NextApiRequest, NextApiResponse } from "next";

type CertificateResponse = {
  eligible: boolean;
  memberName: string | null;
  completedDays: number;
  totalDays: number;
  completedAt: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CertificateResponse>
) {
  const empty: CertificateResponse = {
    eligible: false,
    memberName: null,
    completedDays: 0,
    totalDays: 0,
    completedAt: null,
  };

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json(empty);
  }

  const { slug, email } = req.query;
  if (typeof slug !== "string" || typeof email !== "string" || !email) {
    return res.status(400).json(empty);
  }

  const supabase = createSupabaseServerClient({ req, res });
  if (!supabase) {
    return res.status(200).json(empty);
  }

  const { data: challenge } = await supabase
    .from("challenges")
    .select("id, challenge_days(id)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!challenge) {
    return res.status(200).json(empty);
  }

  const totalDays = challenge.challenge_days?.length ?? 0;

  const { data: checkIns } = await supabase
    .from("check_ins")
    .select("challenge_day_id, member_name, created_at")
    .eq("challenge_id", challenge.id)
    .eq("member_email", email)
    .order("created_at", { ascending: false });

  const rows = checkIns ?? [];
  const completedDays = new Set(rows.map((row) => row.challenge_day_id)).size;
  const eligible = totalDays > 0 && completedDays >= totalDays;

  return res.status(200).json({
    eligible,
    memberName: rows[0]?.member_name ?? null,
    completedDays,
    totalDays,
    completedAt: eligible ? rows[0]?.created_at ?? null : null,
  });
}
