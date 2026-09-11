import type { ChallengeWithDays } from "@/types/challenge";
import { FiCheckCircle } from "react-icons/fi";

const TrackerTab = ({ challenge }: { challenge: ChallengeWithDays }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          Daily Challenge Tracker
        </h2>
        <p className="text-sm text-muted-foreground">
          Check in from the Check-in tab and your progress will show up here.
        </p>
      </div>
      <div className="rounded-3xl border border-primary/10 bg-background px-6 py-6 text-center">
        <p className="text-4xl font-semibold text-primary">
          0/{challenge.challenge_days.length} days
        </p>
        <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
          completed
        </p>
      </div>
      <div className="space-y-3">
        {challenge.challenge_days.map((day) => (
          <div
            key={day.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-primary/10 bg-background px-5 py-4"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Day {day.day_number}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {day.title}
              </p>
            </div>
            <FiCheckCircle className="h-5 w-5 text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackerTab;
