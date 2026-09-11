import type { ChallengeWithDays } from "@/types/challenge";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FiAward, FiPrinter } from "react-icons/fi";
import { useMemberIdentity } from "../hooks/use-member-identity";

type CertificateResponse = {
  eligible: boolean;
  memberName: string | null;
  completedDays: number;
  totalDays: number;
  completedAt: string | null;
};

const fetchCertificate = async (slug: string, email: string) => {
  const response = await fetch(
    `/api/challenges/${slug}/certificate?email=${encodeURIComponent(email)}`
  );
  if (!response.ok) {
    throw new Error("Failed to load your certificate");
  }
  return (await response.json()) as CertificateResponse;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const CertificateTab = ({ challenge }: { challenge: ChallengeWithDays }) => {
  const router = useRouter();
  const { identity, hydrated } = useMemberIdentity();

  const { data, isLoading } = useQuery({
    queryKey: ["challenge-certificate", challenge.slug, identity?.email],
    queryFn: () => fetchCertificate(challenge.slug, identity!.email),
    enabled: hydrated && !!identity?.email,
  });

  const goToCheckIn = () => {
    router.push(
      { pathname: router.pathname, query: { ...router.query, tab: "check-in" } },
      undefined,
      { shallow: true }
    );
  };

  if (!hydrated || (identity && isLoading)) {
    return null;
  }

  if (!identity || !data?.eligible) {
    const completedDays = data?.completedDays ?? 0;
    const totalDays = data?.totalDays ?? challenge.challenge_days.length;
    return (
      <div className="rounded-3xl border border-primary/10 bg-background px-6 py-12 text-center">
        <FiAward className="mx-auto mb-3 h-8 w-8 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Your Certificate of Participation
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {identity
            ? `${completedDays}/${totalDays} days completed. Check in for every day of ${challenge.title} to unlock your certificate.`
            : `Check in for all ${totalDays} days of ${challenge.title} to claim your certificate.`}
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

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-2xl space-y-6 rounded-3xl border-2 border-primary/30 bg-background px-10 py-14 text-center print:border-0">
        <FiAward className="mx-auto h-10 w-10 text-primary" />
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Certificate of Participation
        </p>
        <h2 className="text-3xl font-semibold text-foreground">
          {data.memberName}
        </h2>
        <p className="text-base text-muted-foreground">
          has successfully completed
          <br />
          <span className="font-semibold text-foreground">
            {challenge.title}
          </span>
        </p>
        <p className="text-sm text-muted-foreground">
          {data.completedDays}/{data.totalDays} days
          {data.completedAt ? ` · ${formatDate(data.completedAt)}` : ""}
        </p>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Data Fellows
        </p>
      </div>
      <div className="text-center print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          <FiPrinter className="h-4 w-4" />
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
};

export default CertificateTab;
