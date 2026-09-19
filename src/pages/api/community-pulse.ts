import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { NextApiRequest, NextApiResponse } from "next";

type CommunityPulseResponse = {
  checkedInToday: number;
  distinctMembers: number;
  activeChallenges: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommunityPulseResponse>
) {
  const empty: CommunityPulseResponse = {
    checkedInToday: 0,
    distinctMembers: 0,
    activeChallenges: 0,
  };

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json(empty);
  }

  const supabase = createSupabaseServerClient({ req, res });
  if (!supabase) {
    return res.status(200).json(empty);
  }

  const today = new Date().toISOString().slice(0, 10);
  const startOfToday = `${today}T00:00:00.000Z`;

  const [{ count: checkedInToday }, { data: distinctMembers }, { count: activeChallenges }] =
    await Promise.all([
      supabase
        .from("check_ins")
        .select("id", { count: "exact", head: true })
        .gte("created_at", startOfToday),
      supabase.rpc("count_distinct_members"),
      supabase
        .from("challenges")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .lte("start_date", today)
        .gte("end_date", today),
    ]);

  return res.status(200).json({
    checkedInToday: checkedInToday ?? 0,
    distinctMembers: typeof distinctMembers === "number" ? distinctMembers : 0,
    activeChallenges: activeChallenges ?? 0,
  });
}
