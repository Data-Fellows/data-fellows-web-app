import { activities, ActivityStatus } from "@/constants/activities";
import { site } from "@/constants/site";
import CommunityPulse from "@/components/custom/community-pulse";
import SessionRegisterModal from "@/components/custom/session-register-modal";
import PageSeo from "@/components/seo/page-seo";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import LandingPageLayout from "@/layouts/landing-page";
import type { Challenge } from "@/types/challenge";
import type { Session } from "@/types/session";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiCalendar, FiUsers } from "react-icons/fi";

// Some activity descriptions run several paragraphs (pasted straight from a
// doc) and were blowing up card height on the grid. Clamp to 3 lines and let
// people expand only the ones that actually overflow it. Whether a
// description overflows depends on rendered width and font size, not
// character count -- a "short" description can still wrap past 3 lines on a
// narrow card or with larger text, and a "long" one can fit fine on a wide
// one. So measure the actual clamped element instead of guessing from
// length, and re-measure on resize (grid column count changes at
// breakpoints, text size can change at any time).
const CardDescription = ({ text }: { text: string }) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = paragraphRef.current;
    if (!el) return;

    const checkOverflow = () => {
      // Once expanded there's no clamp to overflow, so scrollHeight always
      // equals clientHeight -- skip the check rather than let it flip
      // isOverflowing to false and hide the "Show less" toggle.
      if (expanded) return;
      setIsOverflowing(el.scrollHeight > el.clientHeight + 1);
    };

    checkOverflow();
    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [text, expanded]);

  if (!text) return null;

  return (
    <div>
      <p
        ref={paragraphRef}
        className={`text-sm text-muted-foreground ${expanded ? "" : "line-clamp-3"}`}
      >
        {text}
      </p>
      {isOverflowing || expanded ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-1 text-xs font-semibold text-primary hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      ) : null}
    </div>
  );
};

const statusStyles: Record<ActivityStatus, string> = {
  Open: "border-foreground text-foreground",
  Ongoing: "border-foreground text-foreground",
  Upcoming: "border-brand-blue-label text-brand-blue-label bg-brand-blue-label/10",
  Closed: "border-border bg-muted text-muted-foreground",
};

type FilterType = "All" | "Challenge" | "Event";
type FilterTime = "All" | "Ongoing" | "Past";

type ActivityCard = {
  key: string;
  type: string;
  // Buckets every card's `type` into just the two groups the filter offers
  // -- "Recurring" activities (Sunday Catchup, DataCamp Learning, etc.)
  // read as events for filtering purposes even though their badge still
  // says "Recurring".
  filterType: Exclude<FilterType, "All">;
  status: ActivityStatus;
  title: string;
  description: string;
  cadence: string;
  href: string;
  external: boolean;
  ctaLabel: string;
  imageUrl?: string | null;
  // ISO date used to sort the list by time. Open-ended activities with no
  // fixed date (the "Recurring" ones) leave this unset and sort after
  // dated cards within the same Ongoing/Past group.
  sortDate?: string;
  // Present only for sessions using in-app registration -- renders the CTA
  // as a button opening the registration modal instead of a Link.
  onRegisterClick?: () => void;
  // Present only for internal-registration sessions that also saved an
  // optional link -- rendered as a secondary "More info" link alongside
  // the Register button, since the admin form promises that URL will be
  // shown to visitors rather than silently unused.
  moreInfoHref?: string | null;
};

const filterTypeOptions: FilterType[] = ["All", "Challenge", "Event"];
const filterTimeOptions: FilterTime[] = ["All", "Ongoing", "Past"];

const filterPillClass = (active: boolean) =>
  `border px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wide transition ${
    active
      ? "border-foreground bg-foreground text-background"
      : "border-border bg-background text-muted-foreground hover:border-foreground/40"
  }`;

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
  }).format(new Date(`${start}T00:00:00Z`))} to ${new Intl.DateTimeFormat("en-US", {
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
  const [registerSession, setRegisterSession] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const [filterType, setFilterType] = useState<FilterType>("All");
  const [filterTime, setFilterTime] = useState<FilterTime>("All");

  const staticCards: ActivityCard[] = activities.map((activity) => ({
    key: activity.title,
    type: activity.type,
    filterType: activity.type === "Challenge" ? "Challenge" : "Event",
    status: activity.status,
    title: activity.title,
    description: activity.description,
    cadence: activity.cadence,
    href: activity.registerHref,
    external: true,
    ctaLabel: activity.status === "Closed" ? "See recap" : "Join",
    imageUrl: activity.image,
  }));

  const challengeCards: ActivityCard[] = challenges.map((challenge) => {
    const status = challengeStatus(challenge);
    return {
      key: challenge.id,
      type: "Challenge",
      filterType: "Challenge",
      status,
      title: challenge.title,
      description: challenge.subtitle || challenge.description || "",
      cadence: formatDateRange(challenge.start_date, challenge.end_date),
      href: `/activities/challenges/${challenge.slug}`,
      external: false,
      ctaLabel: status === "Closed" ? "See recap" : "View challenge",
      imageUrl: challenge.image_url,
      // Closed challenges sort most-recently-ended-first, so their sort
      // key is end_date -- start_date would order them by when they
      // began instead, which can disagree with when they actually ended.
      sortDate: status === "Closed" ? challenge.end_date : challenge.start_date,
    };
  });

  const sessionCards: ActivityCard[] = sessions.map((session) => {
    const status = sessionStatus(session);
    const fallbackHref = "https://bit.ly/m/datafellows";
    const usesInternalRegistration =
      session.registration_mode === "internal" && status !== "Closed";
    const href =
      status === "Closed"
        ? session.replay_url || session.registration_url || fallbackHref
        : session.registration_url || fallbackHref;
    return {
      key: session.id,
      type: "Event",
      filterType: "Event",
      status,
      title: session.title,
      description: session.description || "",
      cadence: formatDate(session.session_date),
      href,
      external: true,
      ctaLabel:
        status === "Closed"
          ? "See recap"
          : usesInternalRegistration
            ? "Register"
            : "Join",
      imageUrl: session.image_url,
      sortDate: session.session_date,
      onRegisterClick: usesInternalRegistration
        ? () => setRegisterSession({ id: session.id, title: session.title })
        : undefined,
      moreInfoHref: usesInternalRegistration ? session.registration_url : null,
    };
  });

  const allCards = [...challengeCards, ...sessionCards, ...staticCards];

  const filteredCards = allCards.filter((card) => {
    if (filterType !== "All" && card.filterType !== filterType) return false;
    if (filterTime === "Ongoing" && card.status === "Closed") return false;
    if (filterTime === "Past" && card.status !== "Closed") return false;
    return true;
  });

  // Ongoing/upcoming cards first (soonest date first), then past ones
  // (most recently ended first). Undated cards (the open-ended "Recurring"
  // activities) sort after dated cards within the same group, keeping
  // their original relative order.
  const cards = [...filteredCards].sort((a, b) => {
    const aClosed = a.status === "Closed";
    const bClosed = b.status === "Closed";
    if (aClosed !== bClosed) return aClosed ? 1 : -1;

    if (!a.sortDate && !b.sortDate) return 0;
    if (!a.sortDate) return 1;
    if (!b.sortDate) return -1;
    return aClosed
      ? b.sortDate.localeCompare(a.sortDate)
      : a.sortDate.localeCompare(b.sortDate);
  });

  return (
    <LandingPageLayout>
      <PageSeo
        title="Programs & Events | Data Fellows"
        description="Explore current and past Data Fellows learning programs, scholarships, workshops, challenges and community events."
        path="/activities"
      />
      <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
        <section
          className="px-4 sm:px-6"
          aria-labelledby="activities-hero-heading"
        >
          <div className="mx-auto max-w-6xl border border-border bg-muted/40 px-6 py-12 lg:px-12">
            <div className="space-y-6 text-center">
              <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Programs and events
              </span>
              <h1
                id="activities-hero-heading"
                className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              >
                Learn, connect and take part.
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
                Browse community learning, technical sessions, challenges and events. Each listing shows whether it is open, ongoing or concluded, with its participation details.
              </p>
              <Link
                href={site.communityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
              >
                <FiUsers className="h-4 w-4" />
                Join the Community
              </Link>
              <CommunityPulse />
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="activities-heading">
          <div className="mx-auto max-w-6xl space-y-10">
            <h2 id="activities-heading" className="sr-only">
              Current activities
            </h2>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {filterTypeOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFilterType(option)}
                    className={filterPillClass(filterType === option)}
                  >
                    {option === "All" ? "All types" : `${option}s`}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {filterTimeOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFilterTime(option)}
                    className={filterPillClass(filterTime === option)}
                  >
                    {option === "All" ? "All time" : option}
                  </button>
                ))}
              </div>
            </div>

            {cards.length === 0 ? (
              <div className="border border-border bg-background px-6 py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Nothing matches these filters yet. Try a different
                  combination.
                </p>
              </div>
            ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <article
                  key={card.key}
                  className="flex h-full flex-col gap-4 overflow-hidden border border-border bg-background px-6 py-6"
                >
                  {card.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin-provided URLs from arbitrary hosts (Canva exports, etc.), can't allowlist every domain for next/image
                    <img
                      src={card.imageUrl}
                      alt=""
                      className="-mx-6 -mt-6 aspect-video w-[calc(100%+3rem)] max-w-none object-cover"
                    />
                  ) : null}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center border border-border bg-muted/40 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {card.type}
                    </span>
                    <span
                      className={`inline-flex items-center border px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wide ${
                        statusStyles[card.status]
                      }`}
                    >
                      {card.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {card.title}
                    </h3>
                    <CardDescription text={card.description} />
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs font-medium text-muted-foreground">
                    <FiCalendar className="h-4 w-4" />
                    {card.cadence}
                  </div>
                  {card.onRegisterClick ? (
                    <div className="mt-auto flex flex-col items-stretch gap-2">
                      <button
                        type="button"
                        onClick={card.onRegisterClick}
                        className="inline-flex items-center justify-center gap-2 border border-foreground bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-foreground/90"
                      >
                        {card.ctaLabel}
                      </button>
                      {card.moreInfoHref ? (
                        <Link
                          href={card.moreInfoHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                        >
                          More info
                          <FiArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : null}
                    </div>
                  ) : (
                    <Link
                      href={card.href}
                      target={card.external ? "_blank" : undefined}
                      rel={card.external ? "noopener noreferrer" : undefined}
                      className={`mt-auto inline-flex items-center justify-center gap-2 border px-5 py-2.5 text-sm font-semibold transition ${
                        card.status === "Closed"
                          ? "border-border text-muted-foreground hover:bg-muted"
                          : "border-foreground bg-foreground text-background hover:bg-foreground/90"
                      }`}
                    >
                      {card.ctaLabel}
                      <FiArrowUpRight className="h-4 w-4" />
                    </Link>
                  )}
                </article>
              ))}
            </div>
            )}
          </div>
        </section>
      </div>
      <SessionRegisterModal
        session={registerSession}
        onClose={() => setRegisterSession(null)}
      />
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

  const [
    { data: challenges, error: challengesError },
    { data: sessions, error: sessionsError },
  ] = await Promise.all([
    supabase
      .from("challenges")
      .select(
        "id, slug, title, subtitle, description, start_date, end_date, daily_commitment, member_target, status, cta_join_label, cta_join_href, partner_name, image_url, created_at, updated_at"
      )
      .eq("status", "published")
      .order("start_date", { ascending: false }),
    supabase
      .from("sessions")
      .select("id, title, description, session_date, registration_url, registration_mode, replay_url, image_url, status, created_at, updated_at")
      .eq("status", "published")
      .order("session_date", { ascending: false }),
  ]);

  // A query error here used to fall through to an empty array with no
  // signal at all -- that's exactly how the Fireside session and Cisco
  // Challenge silently vanished from this page when a column didn't exist
  // yet. Logging server-side means a future occurrence shows up in Vercel
  // logs instead of just looking like "nothing to show".
  if (challengesError) {
    console.error("[activities] failed to load challenges:", challengesError);
  }
  if (sessionsError) {
    console.error("[activities] failed to load sessions:", sessionsError);
  }

  return { props: { challenges: challenges ?? [], sessions: sessions ?? [] } };
};

export default ActivitiesPage;
