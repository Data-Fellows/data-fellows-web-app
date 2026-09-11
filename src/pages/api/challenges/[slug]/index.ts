import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ChallengeWithDays } from "@/types/challenge";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ challenge: ChallengeWithDays | null }>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ challenge: null });
  }

  const { slug } = req.query;
  if (typeof slug !== "string") {
    return res.status(400).json({ challenge: null });
  }

  const supabase = createSupabaseServerClient({ req, res });
  if (!supabase) {
    return res.status(200).json({ challenge: null });
  }

  const { data, error } = await supabase
    .from("challenges")
    .select(
      "id, slug, title, subtitle, description, start_date, end_date, daily_commitment, member_target, status, cta_join_label, cta_join_href, created_at, updated_at, challenge_days(id, challenge_id, day_number, title, lesson_url, summary)"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    return res.status(500).json({ challenge: null });
  }

  if (!data) {
    return res.status(404).json({ challenge: null });
  }

  const challenge_days = [...(data.challenge_days ?? [])].sort(
    (a, b) => a.day_number - b.day_number
  );

  return res.status(200).json({ challenge: { ...data, challenge_days } });
}
