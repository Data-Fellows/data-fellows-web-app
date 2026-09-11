import { dayNumberForToday } from "@/lib/challenge/day-number";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { NextApiRequest, NextApiResponse } from "next";

type TrackerDay = {
  id: string;
  dayNumber: number;
  title: string;
  completed: boolean;
};

type TrackerResponse = {
  days: TrackerDay[];
  completedCount: number;
  totalDays: number;
  todayDayNumber: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TrackerResponse>
) {
  const empty: TrackerResponse = {
    days: [],
    completedCount: 0,
    totalDays: 0,
    todayDayNumber: 0,
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
    .select("id, start_date, challenge_days(id, day_number, title)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!challenge) {
    return res.status(200).json(empty);
  }

  const { data: checkIns } = await supabase
    .from("check_ins")
    .select("challenge_day_id")
    .eq("challenge_id", challenge.id)
    .eq("member_email", email);

  const completedDayIds = new Set(
    (checkIns ?? []).map((row) => row.challenge_day_id)
  );

  const days: TrackerDay[] = [...(challenge.challenge_days ?? [])]
    .sort((a, b) => a.day_number - b.day_number)
    .map((day) => ({
      id: day.id,
      dayNumber: day.day_number,
      title: day.title,
      completed: completedDayIds.has(day.id),
    }));

  return res.status(200).json({
    days,
    completedCount: days.filter((day) => day.completed).length,
    totalDays: days.length,
    todayDayNumber: dayNumberForToday(challenge.start_date),
  });
}
