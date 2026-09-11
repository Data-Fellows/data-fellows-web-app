import type { ChallengeWithDays } from "@/types/challenge";
import { FiClock } from "react-icons/fi";

// Phase A ships the challenge's public read experience. The actual
// check-in submission form lands in Phase B.
const CheckInTab = ({ challenge }: { challenge: ChallengeWithDays }) => {
  return (
    <div className="rounded-3xl border border-primary/10 bg-background px-6 py-12 text-center">
      <FiClock className="mx-auto mb-3 h-8 w-8 text-primary" />
      <h2 className="text-xl font-semibold text-foreground">
        Check-in is opening soon.
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Once {challenge.title} kicks off, you&apos;ll be able to check in
        here each day and share what you learned.
      </p>
    </div>
  );
};

export default CheckInTab;
