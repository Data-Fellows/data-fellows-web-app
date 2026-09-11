import type { ChallengeWithDays } from "@/types/challenge";
import { FiCalendar, FiClock, FiExternalLink } from "react-icons/fi";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00Z`));

const addDays = (isoDate: string, days: number) => {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

const HomeTab = ({ challenge }: { challenge: ChallengeWithDays }) => {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-primary/10 bg-background px-6 py-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <FiCalendar className="h-5 w-5 text-primary" />
            {formatDate(challenge.start_date)} -- {formatDate(challenge.end_date)}
          </div>
          {challenge.daily_commitment ? (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <FiClock className="h-5 w-5 text-primary" />
              {challenge.daily_commitment} daily
            </div>
          ) : null}
        </div>
        {challenge.description ? (
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            {challenge.description}
          </p>
        ) : null}
      </div>

      {challenge.challenge_days.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            The week at a glance
          </h2>
          <div className="grid gap-3">
            {challenge.challenge_days.map((day) => (
              <div
                key={day.id}
                className="flex flex-col gap-1 rounded-2xl border border-primary/10 bg-background px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Day {day.day_number} &middot;{" "}
                    {formatDate(addDays(challenge.start_date, day.day_number - 1))}
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {day.title}
                  </p>
                  {day.summary ? (
                    <p className="text-sm text-muted-foreground">
                      {day.summary}
                    </p>
                  ) : null}
                </div>
                {day.lesson_url ? (
                  <a
                    href={day.lesson_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
                  >
                    Lesson
                    <FiExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default HomeTab;
