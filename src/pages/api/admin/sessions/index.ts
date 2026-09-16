import { requireAdmin } from "@/lib/supabase/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const sessionSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
  session_date: z.string().trim().min(1),
  registration_url: z.string().trim().url().optional().or(z.literal("")),
  replay_url: z.string().trim().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { supabase, admin } = await requireAdmin({ req, res });
  if (!supabase || !admin) {
    return res.status(401).json({ error: "Not authorized" });
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("sessions")
      .select("id, title, description, session_date, registration_url, replay_url, status, created_at, updated_at")
      .order("session_date", { ascending: false });

    if (error) {
      return res.status(500).json({ error: "Failed to load sessions." });
    }
    return res.status(200).json({ sessions: data ?? [] });
  }

  if (req.method === "POST") {
    const parsed = sessionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Please check the form and try again." });
    }
    const values = parsed.data;

    const { data: created, error } = await supabase
      .from("sessions")
      .insert({
        title: values.title,
        description: values.description || null,
        session_date: values.session_date,
        registration_url: values.registration_url || null,
        replay_url: values.replay_url || null,
        status: values.status,
        created_by: admin.id,
      })
      .select("id")
      .single();

    if (error || !created) {
      return res.status(500).json({ error: "Failed to create the session." });
    }

    return res.status(201).json({ id: created.id });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
