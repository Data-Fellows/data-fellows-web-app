import { describeZodError } from "@/lib/api/zod-error";
import { requireAdmin } from "@/lib/supabase/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const resourceSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
  category: z.enum(["Story", "Guide", "Lesson"]),
  href: z.string().trim().url("Enter a valid URL, e.g. https://example.com"),
  image_url: z.string().trim().url("Enter a valid URL, e.g. https://example.com").optional().or(z.literal("")),
  published_date: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { supabase, admin } = await requireAdmin({ req, res });
  if (!supabase || !admin) {
    return res.status(401).json({ error: "Not authorized" });
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("resources")
      .select("id, title, description, category, href, image_url, published_date, status, created_at, updated_at")
      .order("published_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: "Failed to load resources." });
    }
    return res.status(200).json({ resources: data ?? [] });
  }

  if (req.method === "POST") {
    const parsed = resourceSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: describeZodError(parsed.error) });
    }
    const values = parsed.data;

    const { data: created, error } = await supabase
      .from("resources")
      .insert({
        title: values.title,
        description: values.description || null,
        category: values.category,
        href: values.href,
        image_url: values.image_url || null,
        published_date: values.published_date || null,
        status: values.status,
        created_by: admin.id,
      })
      .select("id")
      .single();

    if (error || !created) {
      return res.status(500).json({ error: "Failed to create the resource." });
    }

    return res.status(201).json({ id: created.id });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
