import { requireAdmin } from "@/lib/supabase/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const daySchema = z.object({
  // Present when editing a day that already exists -- absent for a new one.
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1),
  lesson_url: z.string().trim().url().optional().or(z.literal("")),
  summary: z.string().trim().optional(),
});

const challengeSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .min(1)
      .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
    title: z.string().trim().min(1),
    subtitle: z.string().trim().optional(),
    description: z.string().trim().optional(),
    start_date: z.string().trim().min(1),
    end_date: z.string().trim().min(1),
    daily_commitment: z.string().trim().optional(),
    member_target: z.number().int().positive().nullable().optional(),
    status: z.enum(["draft", "published", "archived"]),
    cta_join_label: z.string().trim().optional(),
    cta_join_href: z.string().trim().url().optional().or(z.literal("")),
    partner_name: z.string().trim().optional(),
    days: z.array(daySchema).min(1, "Add at least one day"),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: "End date must be on or after the start date.",
    path: ["end_date"],
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
    return res.status(400).json({ error: "Invalid challenge" });
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("challenges")
      .select(
        "id, slug, title, subtitle, description, start_date, end_date, daily_commitment, member_target, status, cta_join_label, cta_join_href, partner_name, created_at, updated_at, challenge_days(id, challenge_id, day_number, title, lesson_url, summary)"
      )
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return res.status(404).json({ error: "Challenge not found." });
    }

    const challenge_days = [...(data.challenge_days ?? [])].sort(
      (a, b) => a.day_number - b.day_number
    );
    return res.status(200).json({ challenge: { ...data, challenge_days } });
  }

  if (req.method === "PUT") {
    const parsed = challengeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Please check the form and try again." });
    }
    const { days, ...challenge } = parsed.data;

    const { error: updateError } = await supabase
      .from("challenges")
      .update({
        slug: challenge.slug,
        title: challenge.title,
        subtitle: challenge.subtitle || null,
        description: challenge.description || null,
        start_date: challenge.start_date,
        end_date: challenge.end_date,
        daily_commitment: challenge.daily_commitment || null,
        member_target: challenge.member_target ?? null,
        status: challenge.status,
        cta_join_label: challenge.cta_join_label || null,
        cta_join_href: challenge.cta_join_href || null,
        partner_name: challenge.partner_name || null,
      })
      .eq("id", id);

    if (updateError) {
      if (updateError.code === "23505") {
        return res.status(409).json({ error: "That slug is already taken." });
      }
      return res.status(500).json({ error: "Failed to update the challenge." });
    }

    // Upsert days by id: update the ones that already exist, insert the
    // ones that don't, delete the ones that were removed. Never
    // delete-all-then-reinsert -- that would orphan check_ins' foreign key.
    const { data: existingDays } = await supabase
      .from("challenge_days")
      .select("id")
      .eq("challenge_id", id);

    const keepIds = new Set(days.filter((day) => day.id).map((day) => day.id));
    const toDelete = (existingDays ?? [])
      .map((day) => day.id)
      .filter((existingId) => !keepIds.has(existingId));

    if (toDelete.length > 0) {
      const { error } = await supabase.from("challenge_days").delete().in("id", toDelete);
      if (error) {
        return res
          .status(500)
          .json({ error: "The challenge was updated, but removing an old day failed." });
      }
    }

    for (const [index, day] of days.entries()) {
      const dayNumber = index + 1;
      if (day.id) {
        const { error } = await supabase
          .from("challenge_days")
          .update({
            day_number: dayNumber,
            title: day.title,
            lesson_url: day.lesson_url || null,
            summary: day.summary || null,
          })
          .eq("id", day.id);
        if (error) {
          return res.status(500).json({
            error: `The challenge was updated, but saving day ${dayNumber} failed. Reload and check your days before trying again.`,
          });
        }
      } else {
        const { error } = await supabase.from("challenge_days").insert({
          challenge_id: id,
          day_number: dayNumber,
          title: day.title,
          lesson_url: day.lesson_url || null,
          summary: day.summary || null,
        });
        if (error) {
          return res.status(500).json({
            error: `The challenge was updated, but adding day ${dayNumber} failed. Reload and check your days before trying again.`,
          });
        }
      }
    }

    return res.status(200).json({ success: true });
  }

  if (req.method === "PATCH") {
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid status." });
    }
    const { error } = await supabase
      .from("challenges")
      .update({ status: parsed.data.status })
      .eq("id", id);
    if (error) {
      return res.status(500).json({ error: "Failed to update the status." });
    }
    return res.status(200).json({ success: true });
  }

  if (req.method === "DELETE") {
    const { error } = await supabase.from("challenges").delete().eq("id", id);
    if (error) {
      return res.status(500).json({ error: "Failed to delete the challenge." });
    }
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", "GET, PUT, PATCH, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
