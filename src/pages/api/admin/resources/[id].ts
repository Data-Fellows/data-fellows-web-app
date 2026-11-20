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
  author_name: z.string().trim().max(200).optional().or(z.literal("")),
  author_people_slug: z.string().trim().max(200).optional().or(z.literal("")),
  original_publisher: z.string().trim().max(200).optional().or(z.literal("")),
  topic: z.string().trim().max(200).optional().or(z.literal("")),
  featured: z.boolean().optional(),
  is_external_article: z.boolean().optional(),
  editorial_track: z
    .enum(["Business Insights", "Engineering Notes", "Research & Community"])
    .optional()
    .or(z.literal("")),
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
    return res.status(400).json({ error: "Invalid resource" });
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("resources")
      .select(
        "id, title, description, category, href, image_url, published_date, status, author_name, author_people_slug, original_publisher, topic, featured, is_external_article, editorial_track, created_at, updated_at"
      )
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return res.status(404).json({ error: "Resource not found." });
    }
    return res.status(200).json({ resource: data });
  }

  if (req.method === "PUT") {
    const parsed = resourceSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: describeZodError(parsed.error) });
    }
    const values = parsed.data;

    const { error } = await supabase
      .from("resources")
      .update({
        title: values.title,
        description: values.description || null,
        category: values.category,
        href: values.href,
        image_url: values.image_url || null,
        published_date: values.published_date || null,
        status: values.status,
        author_name: values.author_name || null,
        author_people_slug: values.author_people_slug || null,
        original_publisher: values.original_publisher || null,
        topic: values.topic || null,
        featured: values.featured ?? false,
        is_external_article: values.is_external_article ?? true,
        editorial_track: values.editorial_track || null,
      })
      .eq("id", id);

    if (error) {
      return res.status(500).json({ error: "Failed to update the resource." });
    }
    return res.status(200).json({ success: true });
  }

  if (req.method === "PATCH") {
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid status." });
    }
    const { error } = await supabase
      .from("resources")
      .update({ status: parsed.data.status })
      .eq("id", id);
    if (error) {
      return res.status(500).json({ error: "Failed to update the status." });
    }
    return res.status(200).json({ success: true });
  }

  if (req.method === "DELETE") {
    const { error } = await supabase.from("resources").delete().eq("id", id);
    if (error) {
      return res.status(500).json({ error: "Failed to delete the resource." });
    }
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", "GET, PUT, PATCH, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
