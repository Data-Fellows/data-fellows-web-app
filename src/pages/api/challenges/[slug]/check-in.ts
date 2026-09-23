import { dayNumberForToday } from "@/lib/challenge/day-number";
import { describeZodError } from "@/lib/api/zod-error";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const checkInSchema = z.object({
  dayId: z.string().uuid(),
  memberName: z.string().trim().min(1).max(100),
  memberEmail: z.string().trim().email().max(200),
  learningNote: z.string().trim().max(1000).optional(),
  // Honeypot -- real users never see or fill this field. Any non-empty
  // value means a bot, so we accept the request but silently no-op it.
  company: z.string().max(0).optional(),
});

type CheckInResponse = {
  success: boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckInResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  const { slug } = req.query;
  if (typeof slug !== "string") {
    return res.status(400).json({ success: false, error: "Invalid challenge" });
  }

  const parsed = checkInSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, error: describeZodError(parsed.error) });
  }

  const { dayId, memberName, memberEmail, learningNote, company } = parsed.data;

  if (company) {
    return res.status(201).json({ success: true });
  }

  const supabase = createSupabaseServerClient({ req, res });
  if (!supabase) {
    return res
      .status(503)
      .json({ success: false, error: "Check-in isn't available right now." });
  }

  const { data: challenge } = await supabase
    .from("challenges")
    .select("id, start_date")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!challenge) {
    return res.status(404).json({ success: false, error: "Challenge not found." });
  }

  const { data: day } = await supabase
    .from("challenge_days")
    .select("id, day_number")
    .eq("id", dayId)
    .eq("challenge_id", challenge.id)
    .maybeSingle();

  if (!day) {
    return res.status(400).json({ success: false, error: "That day isn't valid." });
  }

  // The client only offers days that have started, but that's UI-only --
  // enforce it here too so a direct API call can't check in for a future
  // day and unlock progress/certificates early.
  if (day.day_number > dayNumberForToday(challenge.start_date)) {
    return res
      .status(400)
      .json({ success: false, error: "That day hasn't started yet." });
  }

  const { error } = await supabase.from("check_ins").insert({
    challenge_id: challenge.id,
    challenge_day_id: dayId,
    member_name: memberName,
    member_email: memberEmail,
    learning_note: learningNote || null,
  });

  if (error) {
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ success: false, error: "You've already checked in for this day." });
    }
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong. Try again." });
  }

  return res.status(201).json({ success: true });
}
