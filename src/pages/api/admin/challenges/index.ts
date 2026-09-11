import { requireAdmin } from "@/lib/supabase/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const daySchema = z.object({
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { supabase, admin } = await requireAdmin({ req, res });
  if (!supabase || !admin) {
    return res.status(401).json({ error: "Not authorized" });
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("challenges")
      .select(
        "id, slug, title, subtitle, description, start_date, end_date, daily_commitment, member_target, status, cta_join_label, cta_join_href, partner_name, created_at, updated_at"
      )
      .order("start_date", { ascending: false });

    if (error) {
      return res.status(500).json({ error: "Failed to load challenges." });
    }
    return res.status(200).json({ challenges: data ?? [] });
  }

  if (req.method === "POST") {
    const parsed = challengeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Please check the form and try again." });
    }
    const { days, ...challenge } = parsed.data;

    const { data: created, error } = await supabase
      .from("challenges")
      .insert({
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
        created_by: admin.id,
      })
      .select("id")
      .single();

    if (error || !created) {
      if (error?.code === "23505") {
        return res.status(409).json({ error: "That slug is already taken." });
      }
      return res.status(500).json({ error: "Failed to create the challenge." });
    }

    const { error: daysError } = await supabase.from("challenge_days").insert(
      days.map((day, index) => ({
        challenge_id: created.id,
        day_number: index + 1,
        title: day.title,
        lesson_url: day.lesson_url || null,
        summary: day.summary || null,
      }))
    );

    if (daysError) {
      return res
        .status(500)
        .json({ error: "Challenge created, but the days failed to save." });
    }

    return res.status(201).json({ id: created.id });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
