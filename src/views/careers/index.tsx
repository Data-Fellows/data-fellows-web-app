import Reveal from "@/components/custom/reveal";
import PageSeo from "@/components/seo/page-seo";
import LandingPageLayout from "@/layouts/landing-page";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

const principles = [
  {
    title: "Senior people, direct work",
    description:
      "We're a small team working close to the problem, not layers of process between you and the client. If you join, you'll be doing the actual engineering, not managing a handoff.",
  },
  {
    title: "Real operational problems",
    description:
      "The work is scoping and building software, data and AI systems for organizations with genuine operational complexity.",
  },
  {
    title: "Grown from a community",
    description:
      "Data Fellows started as a community of people learning data together in 2022, and that's still part of who we are. You'd be joining a studio with that history, not a cold start.",
  },
  {
    title: "Said plainly",
    description:
      "We scope honestly with clients and we'd rather do the same with you: about the role, the stage we're at, and what to actually expect.",
  },
];

const CareersPage = () => {
  return (
    <LandingPageLayout>
      <PageSeo
        title="Careers | Data Fellows"
        description="Careers at Data Fellows: what it's like working at an independent automation studio grown from a community, and how to get in touch about open roles."
        path="/careers"
      />
      <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
        <section className="px-4 sm:px-6" aria-labelledby="careers-hero-heading">
          <div className="mx-auto max-w-6xl border border-border bg-muted/40 px-6 py-12 text-center lg:px-12">
            <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Careers
            </span>
            <h1
              id="careers-hero-heading"
              className="mx-auto mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Build with us.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Data Fellows is a small, senior-led studio solving recurring
              operational problems with software, data and AI, grown out of a
              community that's still part of how we work.
            </p>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="careers-principles-heading">
          <div className="mx-auto max-w-6xl space-y-8">
            <h2
              id="careers-principles-heading"
              className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              What working here looks like.
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {principles.map((item, index) => (
                <Reveal key={item.title} delay={(index % 2) * 0.08}>
                  <div className="border border-border bg-background p-6">
                    <p className="font-display text-lg font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="careers-openings-heading">
          <div className="mx-auto max-w-6xl border border-dashed border-border bg-muted/40 px-6 py-12 text-center lg:px-12">
            <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Open Roles
            </span>
            <h2
              id="careers-openings-heading"
              className="mx-auto mt-4 max-w-2xl font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              Nothing posted right now.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              We don't have an open role listed at the moment. If you think
              there's a fit, as an engineer, a designer or something else,
              tell us what you'd bring and we'll get back to you honestly
              about whether it's a match.
            </p>
            <Link
              href="/contact"
              className="mx-auto mt-6 inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              Get in Touch
              <FiArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="careers-community-heading">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 border border-brand-blue bg-navy-deep px-6 py-10 text-navy-deep-foreground sm:flex-row sm:items-center sm:justify-between lg:px-12">
            <div className="max-w-xl space-y-2">
              <h2
                id="careers-community-heading"
                className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                Not ready to apply? Join the community first.
              </h2>
              <p className="text-sm text-navy-deep-foreground/70">
                Meet the people who work here, see what we're building, and
                get a feel for Data Fellows before any role opens up.
              </p>
            </div>
            <Link
              href="/community"
              className="inline-flex items-center gap-2 border border-brand-blue bg-brand-blue-fill px-6 py-3 text-sm font-semibold text-brand-blue-foreground transition hover:bg-brand-blue-fill/90"
            >
              Join the Community
              <FiArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
};

export default CareersPage;
