import { describeZodError } from "@/lib/api/zod-error";
import { requireAdmin } from "@/lib/supabase/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const sessionSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
  session_date: z.string().trim().min(1),
  registration_url: z.string().trim().url("Enter a valid URL, e.g. https://example.com").optional().or(z.literal("")),
  replay_url: z.string().trim().url("Enter a valid URL, e.g. https://example.com").optional().or(z.literal("")),
  image_url: z.string().trim().url("Enter a valid URL, e.g. https://example.com").optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
});

const statusSchema = z.object({
  status: z.enum(["draft", "published", "archived"]),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { supabase, admin } = await requireAdmin({ req, res });
  if (!supabase || !admin) {
    return res.status(401).json({ error: "Not authorized" });
  }

  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid session" });
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("sessions")
      .select("id, title, description, session_date, registration_url, replay_url, image_url, status, created_at, updated_at")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return res.status(404).json({ error: "Session not found." });
    }
    return res.status(200).json({ session: data });
  }

  if (req.method === "PUT") {
    const parsed = sessionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: describeZodError(parsed.error) });
    }
    const values = parsed.data;

    const { error } = await supabase
      .from("sessions")
      .update({
        title: values.title,
        description: values.description || null,
        session_date: values.session_date,
        registration_url: values.registration_url || null,
        replay_url: values.replay_url || null,
        image_url: values.image_url || null,
        status: values.status,
      })
      .eq("id", id);

    if (error) {
      return res.status(500).json({ error: "Failed to update the session." });
    }
    return res.status(200).json({ success: true });
  }

  if (req.method === "PATCH") {
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid status." });
    }
    const { error } = await supabase
      .from("sessions")
      .update({ status: parsed.data.status })
      .eq("id", id);
    if (error) {
      return res.status(500).json({ error: "Failed to update the status." });
    }
    return res.status(200).json({ success: true });
  }

  if (req.method === "DELETE") {
    const { error } = await supabase.from("sessions").delete().eq("id", id);
    if (error) {
      return res.status(500).json({ error: "Failed to delete the session." });
    }
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", "GET, PUT, PATCH, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
