import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Challenge } from "@/types/challenge";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ challenges: Challenge[] }>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ challenges: [] });
  }

  const supabase = createSupabaseServerClient({ req, res });
  if (!supabase) {
    // No Supabase project connected yet -- graceful empty state, not an error.
    return res.status(200).json({ challenges: [] });
  }

  const { data, error } = await supabase
    .from("challenges")
    .select(
      "id, slug, title, subtitle, description, start_date, end_date, daily_commitment, member_target, status, cta_join_label, cta_join_href, partner_name, image_url, created_at, updated_at"
    )
    .eq("status", "published")
    .order("start_date", { ascending: false });

  if (error) {
    return res.status(500).json({ challenges: [] });
  }

  return res.status(200).json({ challenges: data ?? [] });
}
