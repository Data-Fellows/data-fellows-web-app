import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { WallEntry } from "@/types/challenge";
import type { NextApiRequest, NextApiResponse } from "next";

type WallResponse = {
  items: WallEntry[];
  nextCursor: string | null;
};

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WallResponse>
) {
  const empty: WallResponse = { items: [], nextCursor: null };

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json(empty);
  }

  const { slug, day, cursor, limit: limitParam } = req.query;
  if (typeof slug !== "string") {
    return res.status(400).json(empty);
  }

  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number(limitParam) || DEFAULT_LIMIT)
  );

  const supabase = createSupabaseServerClient({ req, res });
  if (!supabase) {
    return res.status(200).json(empty);
  }

  const { data: challenge } = await supabase
    .from("challenges")
    .select("id")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!challenge) {
    return res.status(200).json(empty);
  }

  let query = supabase
    .from("check_ins")
    .select(
      "id, learning_note, completed, created_at, challenge_day_id, challenge_days(day_number, title), member_name"
    )
    .eq("challenge_id", challenge.id)
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (typeof cursor === "string" && cursor) {
    query = query.lt("created_at", cursor);
  }

  if (typeof day === "string" && day) {
    const dayNumber = Number(day);
    const { data: dayRow } = await supabase
      .from("challenge_days")
      .select("id")
      .eq("challenge_id", challenge.id)
      .eq("day_number", dayNumber)
      .maybeSingle();

    if (!dayRow) {
      return res.status(200).json(empty);
    }
    query = query.eq("challenge_day_id", dayRow.id);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json(empty);
  }

  const rows = data ?? [];
  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;

  const items: WallEntry[] = page.map((row) => {
    const dayInfo = Array.isArray(row.challenge_days)
      ? row.challenge_days[0]
      : row.challenge_days;
    return {
      id: row.id,
      member_name: row.member_name,
      learning_note: row.learning_note,
      completed: row.completed,
      created_at: row.created_at,
      challenge_day_id: row.challenge_day_id,
      day_number: dayInfo?.day_number ?? 0,
      day_title: dayInfo?.title ?? "",
    };
  });

  return res.status(200).json({
    items,
    nextCursor: hasMore ? page[page.length - 1].created_at : null,
  });
}
