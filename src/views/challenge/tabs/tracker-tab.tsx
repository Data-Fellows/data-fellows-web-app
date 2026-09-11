import type { ChallengeWithDays } from "@/types/challenge";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { useMemberIdentity } from "../hooks/use-member-identity";

type TrackerDay = {
  id: string;
  dayNumber: number;
  title: string;
  completed: boolean;
};

type TrackerResponse = {
  days: TrackerDay[];
  completedCount: number;
  totalDays: number;
  todayDayNumber: number;
};

const fetchTracker = async (slug: string, email: string) => {
  const response = await fetch(
    `/api/challenges/${slug}/tracker?email=${encodeURIComponent(email)}`
  );
  if (!response.ok) {
    throw new Error("Failed to load your tracker");
  }
  return (await response.json()) as TrackerResponse;
};

const TrackerTab = ({ challenge }: { challenge: ChallengeWithDays }) => {
  const router = useRouter();
  const { identity, hydrated } = useMemberIdentity();

  const { data, isLoading } = useQuery({
    queryKey: ["challenge-tracker", challenge.slug, identity?.email],
    queryFn: () => fetchTracker(challenge.slug, identity!.email),
    enabled: hydrated && !!identity?.email,
  });

  const goToCheckIn = () => {
    router.push(
      { pathname: router.pathname, query: { ...router.query, tab: "check-in" } },
      undefined,
      { shallow: true }
    );
  };

  if (!hydrated) {
    return null;
  }

  if (!identity) {
    return (
      <div className="rounded-3xl border border-primary/10 bg-background px-6 py-12 text-center">
        <FiCircle className="mx-auto mb-3 h-8 w-8 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          No check-ins yet
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Check in for a day to start tracking your progress here.
        </p>
        <button
          type="button"
          onClick={goToCheckIn}
          className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Go to check-in
        </button>
      </div>
    );
  }

  const days =
    data?.days ??
    challenge.challenge_days.map((day) => ({
      id: day.id,
      dayNumber: day.day_number,
      title: day.title,
      completed: false,
    }));
  const completedCount = data?.completedCount ?? 0;
  const totalDays = data?.totalDays ?? challenge.challenge_days.length;

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          Daily Challenge Tracker
        </h2>
        <p className="text-sm text-muted-foreground">
          {identity.name
            ? `Keep it up, ${identity.name.split(" ")[0]}.`
            : "Your progress across the challenge."}
        </p>
      </div>
      <div className="rounded-3xl border border-primary/10 bg-background px-6 py-6 text-center">
        <p className="text-4xl font-semibold text-primary">
          {isLoading ? "--" : `${completedCount}/${totalDays}`} days
        </p>
        <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
          completed
        </p>
      </div>
      <div className="space-y-3">
        {days.map((day) => (
          <div
            key={day.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-primary/10 bg-background px-5 py-4"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Day {day.dayNumber}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {day.title}
              </p>
            </div>
            {day.completed ? (
              <FiCheckCircle className="h-5 w-5 text-primary" />
            ) : (
              <FiCircle className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackerTab;
