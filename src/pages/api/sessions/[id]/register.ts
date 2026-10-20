import { describeZodError } from "@/lib/api/zod-error";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(200),
  // Honeypot -- real users never see or fill this field. Any non-empty
  // value means a bot, so we accept the request but silently no-op it.
  // Bounded rather than max(0): a max(0) field rejects any non-empty
  // value at the schema level, so a bot that actually fills it in would
  // fail validation and get an explicit 400 here instead of ever reaching
  // the no-op branch below -- the opposite of "silent".
  company: z.string().max(500).optional(),
});

type RegisterResponse = {
  success: boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ success: false, error: "Invalid session" });
  }

  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: describeZodError(parsed.error) });
  }

  const { name, email, company } = parsed.data;

  if (company) {
    return res.status(201).json({ success: true });
  }

  const supabase = createSupabaseServerClient({ req, res });
  if (!supabase) {
    return res
      .status(503)
      .json({ success: false, error: "Registration isn't available right now." });
  }

  const { data: session } = await supabase
    .from("sessions")
    .select("id, session_date")
    .eq("id", id)
    .eq("status", "published")
    .eq("registration_mode", "internal")
    .maybeSingle();

  if (!session) {
    return res.status(404).json({ success: false, error: "Session not found." });
  }

  // The client only offers Register while the session is still upcoming,
  // but that's UI-only -- a published row stays published after its date
  // passes (so /activities can show it as Closed with a replay link), so
  // enforce it here too rather than relying on the RLS policy alone to
  // stop a direct API call from registering for a session that already
  // happened.
  const today = new Date().toISOString().slice(0, 10);
  if (session.session_date < today) {
    return res
      .status(400)
      .json({ success: false, error: "Registration for this session has closed." });
  }

  const { error } = await supabase.from("session_registrations").insert({
    session_id: session.id,
    name,
    email,
  });

  if (error) {
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ success: false, error: "You're already registered for this session." });
    }
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong. Try again." });
  }

  return res.status(201).json({ success: true });
}
