import PageSeo from "@/components/seo/page-seo";
import {
  engagementTimeline,
  principles,
  processSteps,
  transparency,
} from "@/constants/approach";
import LandingPageLayout from "@/layouts/landing-page";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

const ApproachPage = () => {
  return (
    <LandingPageLayout>
      <PageSeo
        title="Our Approach -- Data Fellows"
        description="How Data Fellows scopes, builds and supports software, data and AI work -- evidence before commitment, the smallest responsible solution, and direct technical collaboration."
        path="/approach"
      />
      <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
        <section className="px-4 sm:px-6" aria-labelledby="approach-hero-heading">
          <div className="mx-auto max-w-6xl border border-border bg-muted/40 px-6 py-12 text-center lg:px-12">
            <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Our Approach
            </span>
            <h1
              id="approach-hero-heading"
              className="mx-auto mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Evidence before commitment. The smallest solution that works.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              We'd rather scope a narrow, honest project than sell a big one
              we can't back up. Here's how we actually work, from the first
              conversation to ongoing support.
            </p>
            <Link
              href="/contact"
              className="mx-auto mt-6 inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              Start a Conversation
              <FiArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="approach-process-heading">
          <div className="mx-auto max-w-6xl space-y-8">
            <h2
              id="approach-process-heading"
              className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              How a project actually moves.
            </h2>
            <div className="grid gap-4 md:grid-cols-5">
              {processSteps.map((item) => (
                <div
                  key={item.step}
                  className="border border-border bg-background p-5"
                >
                  <div className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    {item.step}
                  </div>
                  <p className="mt-2 font-display text-base font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="approach-principles-heading">
          <div className="mx-auto max-w-6xl space-y-8">
            <h2
              id="approach-principles-heading"
              className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              What we hold to on every engagement.
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {principles.map((item) => (
                <div
                  key={item.title}
                  className="border border-border bg-muted/40 p-6"
                >
                  <p className="font-display text-lg font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="approach-transparency-heading">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="max-w-2xl space-y-3">
              <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Said Plainly
              </span>
              <h2
                id="approach-transparency-heading"
                className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                What we can do today, what needs a partner, and what we don't offer.
              </h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="border border-foreground bg-background p-6">
                <p className="font-mono text-xs font-semibold uppercase tracking-wide text-foreground">
                  Can do today
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {transparency.canDo.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="border border-border bg-muted/40 p-6">
                <p className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Needs a partner
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {transparency.needsPartner.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="border border-border bg-muted/40 p-6">
                <p className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Not offered right now
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {transparency.notOffered.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="approach-timeline-heading">
          <div className="mx-auto max-w-6xl border border-gold bg-navy-deep px-6 py-12 text-navy-deep-foreground lg:px-12">
            <span className="font-mono text-xs font-medium uppercase tracking-wide text-gold">
              Engagement Timeline
            </span>
            <h2
              id="approach-timeline-heading"
              className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              From first conversation to ongoing support.
            </h2>
            <ol className="mt-8 flex flex-wrap gap-3">
              {engagementTimeline.map((item, index) => (
                <li
                  key={item}
                  className="flex items-center gap-2 border border-navy-deep-foreground/20 px-4 py-2 font-mono text-xs uppercase tracking-wide"
                >
                  <span className="text-gold">0{index + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="approach-cta-heading">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 border border-foreground bg-background px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-12">
            <div className="max-w-xl space-y-2">
              <h2
                id="approach-cta-heading"
                className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                Have a problem that keeps coming back?
              </h2>
              <p className="text-sm text-muted-foreground">
                Tell us what&apos;s happening, what&apos;s been tried, and
                what a better outcome would look like.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              Start a Conversation
              <FiArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
};

export default ApproachPage;
