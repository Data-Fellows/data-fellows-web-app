import { createSupabaseServerClient } from "@/lib/supabase/server";
import LandingPageLayout from "@/layouts/landing-page";
import type { ChallengeWithDays } from "@/types/challenge";
import { challengeTabs, ChallengeTabId } from "@/constants/challenge-tabs";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiUsers } from "react-icons/fi";
import CertificateTab from "./tabs/certificate-tab";
import CheckInTab from "./tabs/check-in-tab";
import HomeTab from "./tabs/home-tab";
import TrackerTab from "./tabs/tracker-tab";
import WallTab from "./tabs/wall-tab";

type ChallengePageProps = {
  challenge: ChallengeWithDays | null;
};

const isChallengeTabId = (value: unknown): value is ChallengeTabId =>
  typeof value === "string" &&
  challengeTabs.some((tab) => tab.id === value);

const ChallengePage = ({ challenge }: ChallengePageProps) => {
  const router = useRouter();
  const activeTab = isChallengeTabId(router.query.tab)
    ? router.query.tab
    : "home";

  const setTab = (tab: ChallengeTabId) => {
    router.push(
      { pathname: router.pathname, query: { ...router.query, tab } },
      undefined,
      { shallow: true }
    );
  };

  if (!challenge) {
    return (
      <LandingPageLayout>
        <div className="px-4 pt-28 sm:px-6 md:pt-32">
          <div className="mx-auto max-w-3xl rounded-3xl border border-primary/10 bg-secondary/10 px-6 py-16 text-center">
            <h1 className="text-2xl font-semibold text-foreground">
              This challenge isn&apos;t available.
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              It may have been unpublished, or the link is incorrect.
            </p>
            <Link
              href="/activities"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              See all activities
            </Link>
          </div>
        </div>
      </LandingPageLayout>
    );
  }

  return (
    <LandingPageLayout>
      <div className="space-y-10 pt-28 md:pt-32">
        <section className="px-4 sm:px-6">
          <div className="mx-auto max-w-5xl space-y-6 rounded-3xl border border-primary/10 bg-secondary/10 px-6 py-12 lg:px-12">
            <div className="space-y-4 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                Challenge
              </span>
              <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
                {challenge.title}
              </h1>
              {challenge.subtitle ? (
                <p className="mx-auto max-w-2xl text-base text-muted-foreground">
                  {challenge.subtitle}
                </p>
              ) : null}
              <Link
                href={challenge.cta_join_href || "https://bit.ly/m/datafellows"}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                <FiUsers className="h-4 w-4" />
                {challenge.cta_join_label || "Join the Challenge"}
              </Link>
            </div>

            <div className="mx-auto flex max-w-xl flex-wrap justify-center gap-2">
              {challengeTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTab(tab.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-primary/20 bg-background text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6">
          <div className="mx-auto max-w-5xl">
            {activeTab === "home" ? <HomeTab challenge={challenge} /> : null}
            {activeTab === "tracker" ? (
              <TrackerTab challenge={challenge} />
            ) : null}
            {activeTab === "check-in" ? (
              <CheckInTab challenge={challenge} />
            ) : null}
            {activeTab === "wall" ? <WallTab challenge={challenge} /> : null}
            {activeTab === "certificate" ? (
              <CertificateTab challenge={challenge} />
            ) : null}
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<
  ChallengePageProps
> = async ({ params, req, res }) => {
  const slug = params?.slug;
  if (typeof slug !== "string") {
    return { props: { challenge: null } };
  }

  const supabase = createSupabaseServerClient({ req, res });
  if (!supabase) {
    return { props: { challenge: null } };
  }

  const { data } = await supabase
    .from("challenges")
    .select(
      "id, slug, title, subtitle, description, start_date, end_date, daily_commitment, member_target, status, cta_join_label, cta_join_href, partner_name, created_at, updated_at, challenge_days(id, challenge_id, day_number, title, lesson_url, summary)"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!data) {
    return { props: { challenge: null } };
  }

  const challenge_days = [...(data.challenge_days ?? [])].sort(
    (a, b) => a.day_number - b.day_number
  );

  return { props: { challenge: { ...data, challenge_days } } };
};

export default ChallengePage;
