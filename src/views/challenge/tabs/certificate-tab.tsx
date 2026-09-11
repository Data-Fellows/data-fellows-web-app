import type { ChallengeWithDays } from "@/types/challenge";
import { FiAward } from "react-icons/fi";

// Phase A ships the challenge's public read experience. Certificates
// unlock once the check-in flow (Phase B) is live.
const CertificateTab = ({ challenge }: { challenge: ChallengeWithDays }) => {
  return (
    <div className="rounded-3xl border border-primary/10 bg-background px-6 py-12 text-center">
      <FiAward className="mx-auto mb-3 h-8 w-8 text-primary" />
      <h2 className="text-xl font-semibold text-foreground">
        Your Certificate of Participation
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Check in for all {challenge.challenge_days.length} days of{" "}
        {challenge.title} to claim your certificate. Check-in opens soon.
      </p>
    </div>
  );
};

export default CertificateTab;
