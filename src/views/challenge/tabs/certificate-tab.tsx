import type { ChallengeWithDays } from "@/types/challenge";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
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

const formatDateRange = (start: string, end: string) =>
  `${new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${start}T00:00:00Z`))} -- ${new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${end}T00:00:00Z`))}`;

const CertificateTab = ({ challenge }: { challenge: ChallengeWithDays }) => {
  const router = useRouter();
  const { identity, hydrated } = useMemberIdentity();

  const { data, isLoading } = useQuery({
    queryKey: ["challenge-certificate", challenge.slug, identity?.email],
    queryFn: () => fetchCertificate(challenge.slug, identity!.email),
    enabled: hydrated && !!identity?.email,
  });

  const goToTab = (tab: "check-in" | "tracker") => {
    router.push(
      { pathname: router.pathname, query: { ...router.query, tab } },
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
          onClick={() => goToTab("check-in")}
          className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Go to check-in
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        id="certificate"
        className="mx-auto max-w-2xl space-y-7 rounded-3xl border border-primary/20 bg-gradient-to-b from-secondary/20 to-background px-8 py-12 text-center sm:px-14 print:border-primary/30 print:bg-none"
      >
        <div className="flex items-center justify-center gap-3">
          <Image
            src="/svgs/data-fellow.svg"
            alt="Data Fellows"
            width={120}
            height={40}
            className="h-9 w-auto"
          />
          <span className="h-8 w-px bg-primary/20" aria-hidden="true" />
          <FiAward className="h-8 w-8 text-primary" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          Certificate of Participation
        </p>

        <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
          {data.memberName}
        </h2>

        <p className="text-base text-muted-foreground">
          has successfully completed
          <br />
          <span className="text-lg font-semibold text-foreground">
            {challenge.title}
          </span>
        </p>

        <p className="text-sm text-muted-foreground">
          {formatDateRange(challenge.start_date, challenge.end_date)}
          {challenge.daily_commitment ? ` · ${challenge.daily_commitment} daily` : ""}
        </p>

        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
          {data.completedDays}/{data.totalDays} days
          {data.completedAt ? ` · ${formatDate(data.completedAt)}` : ""}
        </span>

        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Issued by Data Fellows
          {challenge.partner_name ? ` · Powered by ${challenge.partner_name}` : ""}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          <FiPrinter className="h-4 w-4" />
          Print / Save as PDF
        </button>
        <button
          type="button"
          onClick={() => goToTab("tracker")}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-6 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/40"
        >
          Back to tracker
        </button>
      </div>
    </div>
  );
};

export default CertificateTab;
