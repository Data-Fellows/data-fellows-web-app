import { dayNumberForToday } from "@/lib/challenge/day-number";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { NextApiRequest, NextApiResponse } from "next";

type StatsResponse = {
  checkedInToday: number;
  target: number | null;
  totalParticipants: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatsResponse>
) {
  const empty: StatsResponse = {
    checkedInToday: 0,
    target: null,
    totalParticipants: 0,
  };

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json(empty);
  }

  const { slug } = req.query;
  if (typeof slug !== "string") {
    return res.status(400).json(empty);
  }

  const supabase = createSupabaseServerClient({ req, res });
  if (!supabase) {
    return res.status(200).json(empty);
  }

  const { data: challenge } = await supabase
    .from("challenges")
    .select("id, start_date, member_target")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!challenge) {
    return res.status(200).json(empty);
  }

  const todayDayNumber = dayNumberForToday(challenge.start_date);

  const { data: todayDay } = await supabase
    .from("challenge_days")
    .select("id")
    .eq("challenge_id", challenge.id)
    .eq("day_number", todayDayNumber)
    .maybeSingle();

  let checkedInToday = 0;
  if (todayDay) {
    const { count } = await supabase
      .from("check_ins")
      .select("id", { count: "exact", head: true })
      .eq("challenge_day_id", todayDay.id);
    checkedInToday = count ?? 0;
  }

  const { data: allCheckIns } = await supabase
    .from("check_ins")
    .select("member_email")
    .eq("challenge_id", challenge.id);

  const totalParticipants = new Set(
    (allCheckIns ?? []).map((row) => row.member_email)
  ).size;

  return res.status(200).json({
    checkedInToday,
    target: challenge.member_target,
    totalParticipants,
  });
}
