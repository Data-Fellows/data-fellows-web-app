import { activities, ActivityStatus } from "@/constants/activities";
import LandingPageLayout from "@/layouts/landing-page";
import Link from "next/link";
import { FiArrowUpRight, FiCalendar, FiUsers } from "react-icons/fi";

const statusStyles: Record<ActivityStatus, string> = {
  Open: "border-primary/30 bg-primary/10 text-primary",
  Ongoing: "border-primary/30 bg-primary/10 text-primary",
  Upcoming: "border-accent/30 bg-accent/10 text-accent-foreground",
  Closed: "border-border bg-muted text-muted-foreground",
};

const ActivitiesPage = () => {
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
              {activities.map((activity) => (
                <article
                  key={activity.title}
                  className="flex h-full flex-col gap-4 rounded-3xl border border-primary/10 bg-background px-6 py-6"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-primary/10 bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {activity.type}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                        statusStyles[activity.status]
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <FiCalendar className="h-4 w-4" />
                    {activity.cadence}
                  </div>
                  <Link
                    href={activity.registerHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                      activity.status === "Closed"
                        ? "border border-border text-muted-foreground hover:bg-muted"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {activity.status === "Closed" ? "See recap" : "Register"}
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

export default ActivitiesPage;
