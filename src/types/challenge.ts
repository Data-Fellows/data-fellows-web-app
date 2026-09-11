export type ChallengeStatus = "draft" | "published" | "archived";

export type Challenge = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  start_date: string;
  end_date: string;
  daily_commitment: string | null;
  member_target: number | null;
  status: ChallengeStatus;
  cta_join_label: string | null;
  cta_join_href: string | null;
  created_at: string;
  updated_at: string;
};

export type ChallengeDay = {
  id: string;
  challenge_id: string;
  day_number: number;
  title: string;
  lesson_url: string | null;
  summary: string | null;
};

export type ChallengeWithDays = Challenge & {
  challenge_days: ChallengeDay[];
};

export type CheckIn = {
  id: string;
  challenge_id: string;
  challenge_day_id: string;
  member_name: string;
  member_email: string;
  learning_note: string | null;
  completed: boolean;
  created_at: string;
};

// Public-safe projection of a check-in (never includes member_email).
export type WallEntry = Pick<
  CheckIn,
  "id" | "member_name" | "learning_note" | "completed" | "created_at"
> & {
  challenge_day_id: string;
  day_number: number;
  day_title: string;
};
