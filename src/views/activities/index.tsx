import { activities, ActivityStatus } from "@/constants/activities";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import LandingPageLayout from "@/layouts/landing-page";
import type { Challenge } from "@/types/challenge";
import type { Session } from "@/types/session";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { FiArrowUpRight, FiCalendar, FiUsers } from "react-icons/fi";

const statusStyles: Record<ActivityStatus, string> = {
  Open: "border-primary/30 bg-primary/10 text-primary",
  Ongoing: "border-primary/30 bg-primary/10 text-primary",
  Upcoming: "border-accent/30 bg-accent/10 text-accent-foreground",
  Closed: "border-border bg-muted text-muted-foreground",
};

type ActivityCard = {
  key: string;
  type: string;
  status: ActivityStatus;
  title: string;
  description: string;
  cadence: string;
  href: string;
  external: boolean;
  ctaLabel: string;
};

const challengeStatus = (challenge: Challenge): ActivityStatus => {
  const today = new Date().toISOString().slice(0, 10);
  if (today < challenge.start_date) return "Upcoming";
  if (today > challenge.end_date) return "Closed";
  return "Ongoing";
};

const formatDateRange = (start: string, end: string) =>
  `${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${start}T00:00:00Z`))} -- ${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${end}T00:00:00Z`))}`;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));

const sessionStatus = (session: Session): ActivityStatus => {
  const today = new Date().toISOString().slice(0, 10);
  if (today < session.session_date) return "Upcoming";
  if (today > session.session_date) return "Closed";
  return "Open";
};

type ActivitiesPageProps = {
  challenges: Challenge[];
  sessions: Session[];
};

const ActivitiesPage = ({ challenges, sessions }: ActivitiesPageProps) => {
  const staticCards: ActivityCard[] = activities.map((activity) => ({
    key: activity.title,
    type: activity.type,
    status: activity.status,
    title: activity.title,
    description: activity.description,
    cadence: activity.cadence,
    href: activity.registerHref,
    external: true,
    ctaLabel: activity.status === "Closed" ? "See recap" : "Join",
  }));

  const challengeCards: ActivityCard[] = challenges.map((challenge) => {
    const status = challengeStatus(challenge);
    return {
      key: challenge.id,
      type: "Challenge",
      status,
      title: challenge.title,
      description: challenge.subtitle || challenge.description || "",
      cadence: formatDateRange(challenge.start_date, challenge.end_date),
      href: `/activities/challenges/${challenge.slug}`,
      external: false,
      ctaLabel: status === "Closed" ? "See recap" : "View challenge",
    };
  });

  const sessionCards: ActivityCard[] = sessions.map((session) => {
    const status = sessionStatus(session);
    const fallbackHref = "https://bit.ly/m/datafellows";
    const href =
      status === "Closed"
        ? session.replay_url || session.registration_url || fallbackHref
        : session.registration_url || fallbackHref;
    return {
      key: session.id,
      type: "Event",
      status,
      title: session.title,
      description: session.description || "",
      cadence: formatDate(session.session_date),
      href,
      external: true,
      ctaLabel: status === "Closed" ? "See recap" : "Join",
    };
  });

  const cards = [...challengeCards, ...sessionCards, ...staticCards];

  return (
    <LandingPageLayout>
      <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
        <section
          className="px-4 sm:px-6"
          aria-labelledby="activities-hero-heading"
        >
          <div className="mx-auto max-w-6xl rounded-3xl border border-primary/10 bg-secondary/10 px-6 py-12 lg:px-12">
            <div className="space-y-6 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                Activities
              </span>
              <h1
                id="activities-hero-heading"
                className="text-3xl font-semibold text-foreground sm:text-4xl"
              >
                Everything happening in the community right now.
              </h1>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground">
                Challenges, events, and recurring sessions Fellows can join --
                register below to take part.
              </p>
              <Link
                href="https://bit.ly/m/datafellows"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                <FiUsers className="h-4 w-4" />
                Join the Community
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="activities-heading">
          <div className="mx-auto max-w-6xl space-y-10">
            <h2 id="activities-heading" className="sr-only">
              Current activities
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <article
                  key={card.key}
                  className="flex h-full flex-col gap-4 rounded-3xl border border-primary/10 bg-background px-6 py-6"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-primary/10 bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {card.type}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                        statusStyles[card.status]
                      }`}
                    >
                      {card.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <FiCalendar className="h-4 w-4" />
                    {card.cadence}
                  </div>
                  <Link
                    href={card.href}
                    target={card.external ? "_blank" : undefined}
                    rel={card.external ? "noopener noreferrer" : undefined}
                    className={`mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                      card.status === "Closed"
                        ? "border border-border text-muted-foreground hover:bg-muted"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {card.ctaLabel}
                    <FiArrowUpRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<
  ActivitiesPageProps
> = async ({ req, res }) => {
  const supabase = createSupabaseServerClient({ req, res });
  if (!supabase) {
    return { props: { challenges: [], sessions: [] } };
  }

  const [{ data: challenges }, { data: sessions }] = await Promise.all([
    supabase
      .from("challenges")
      .select(
        "id, slug, title, subtitle, description, start_date, end_date, daily_commitment, member_target, status, cta_join_label, cta_join_href, partner_name, created_at, updated_at"
      )
      .eq("status", "published")
      .order("start_date", { ascending: false }),
    supabase
      .from("sessions")
      .select("id, title, description, session_date, registration_url, replay_url, status, created_at, updated_at")
      .eq("status", "published")
      .order("session_date", { ascending: false }),
  ]);

  return { props: { challenges: challenges ?? [], sessions: sessions ?? [] } };
};

export default ActivitiesPage;
