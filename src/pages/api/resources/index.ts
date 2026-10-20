import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Resource } from "@/types/resource";
import type { NextApiRequest, NextApiResponse } from "next";

type ResourcesResponse = {
  resources: Resource[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResourcesResponse>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ resources: [] });
  }

  const supabase = createSupabaseServerClient({ req, res });
  if (!supabase) {
    return res.status(200).json({ resources: [] });
  }

  const { data, error } = await supabase
    .from("resources")
    .select("id, title, description, category, href, image_url, published_date, status, created_at, updated_at")
    .eq("status", "published")
    .order("published_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[api/resources] failed to load resources:", error);
    return res.status(200).json({ resources: [] });
  }

  return res.status(200).json({ resources: data ?? [] });
}
