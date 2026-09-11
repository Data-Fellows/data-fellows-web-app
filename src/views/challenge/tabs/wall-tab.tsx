import type { ChallengeWithDays, WallEntry } from "@/types/challenge";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FiMessageCircle } from "react-icons/fi";

const formatTimestamp = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const fetchWall = async (slug: string, day: number | "all", cursor?: string) => {
  const params = new URLSearchParams();
  if (day !== "all") params.set("day", String(day));
  if (cursor) params.set("cursor", cursor);
  const response = await fetch(
    `/api/challenges/${slug}/wall?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error("Failed to load the community wall");
  }
  return (await response.json()) as {
    items: WallEntry[];
    nextCursor: string | null;
  };
};

const WallTab = ({ challenge }: { challenge: ChallengeWithDays }) => {
  const [dayFilter, setDayFilter] = useState<number | "all">("all");
  const [entries, setEntries] = useState<WallEntry[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  const { data, isLoading } = useQuery({
    queryKey: ["challenge-wall", challenge.slug, dayFilter, cursor],
    queryFn: () => fetchWall(challenge.slug, dayFilter, cursor),
    refetchInterval: cursor ? false : 20000,
    staleTime: 0,
  });

  const items = cursor ? [...entries, ...(data?.items ?? [])] : data?.items ?? [];

  const handleFilterChange = (value: number | "all") => {
    setDayFilter(value);
    setEntries([]);
    setCursor(undefined);
  };

  const handleLoadMore = () => {
    if (!data?.nextCursor) return;
    setEntries((prev) => [...prev, ...(data?.items ?? [])]);
    setCursor(data.nextCursor);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          What the cohort is learning
        </h2>
        <p className="text-sm text-muted-foreground">
          A live feed of check-ins, insights, and tiny wins.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => handleFilterChange("all")}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
            dayFilter === "all"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-primary/20 bg-background text-muted-foreground hover:border-primary/40"
          }`}
        >
          All
        </button>
        {challenge.challenge_days.map((day) => (
          <button
            key={day.id}
            type="button"
            onClick={() => handleFilterChange(day.day_number)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
              dayFilter === day.day_number
                ? "border-primary bg-primary text-primary-foreground"
                : "border-primary/20 bg-background text-muted-foreground hover:border-primary/40"
            }`}
          >
            Day {day.day_number}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {items.length === 0 && !isLoading ? (
          <div className="rounded-2xl border border-primary/10 bg-background px-6 py-10 text-center text-sm text-muted-foreground">
            <FiMessageCircle className="mx-auto mb-2 h-6 w-6 text-primary" />
            No check-ins yet -- be the first to share what you learned.
          </div>
        ) : null}
        {items.map((entry) => (
          <article
            key={entry.id}
            className="rounded-2xl border border-primary/10 bg-background px-5 py-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">
                {entry.member_name}
              </p>
              <p className="text-xs text-muted-foreground">
                Day {entry.day_number} &middot; {formatTimestamp(entry.created_at)}
              </p>
            </div>
            {entry.learning_note ? (
              <p className="mt-2 text-sm text-muted-foreground">
                {entry.learning_note}
              </p>
            ) : null}
          </article>
        ))}
      </div>

      {data?.nextCursor ? (
        <div className="text-center">
          <button
            type="button"
            onClick={handleLoadMore}
            className="rounded-full border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10"
          >
            Load more
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default WallTab;
