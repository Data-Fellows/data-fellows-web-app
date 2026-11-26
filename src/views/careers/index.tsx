import Reveal from "@/components/custom/reveal";
import PageSeo from "@/components/seo/page-seo";
import LandingPageLayout from "@/layouts/landing-page";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

const principles = [
  {
    title: "Community at the centre",
    description:
      "Data Fellows brings people together to learn, develop professionally and explore technology across data, AI and software.",
  },
  {
    title: "Learn and build together",
    description:
      "Community activities may include learning initiatives, mentorship, workshops, technical projects and professional conversations.",
  },
  {
    title: "Grown from a community",
    description:
      "Data Fellows began in 2022 and has grown into a global community of more than 1,600 professionals across 33 countries.",
  },
  {
    title: "Clear participation",
    description:
      "Community participation does not imply employment or project assignment. Opportunities and expectations are shared for each activity.",
  },
];

const CareersPage = () => {
  return (
    <LandingPageLayout>
      <PageSeo
        title="Careers | Data Fellows"
        description="Explore Data Fellows community participation and current activity listings. No open employment roles are listed at this time."
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
              Data Fellows is a global, community-led technology organization. This page lists employment openings only when they have been confirmed and published.
            </p>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="careers-principles-heading">
          <div className="mx-auto max-w-6xl space-y-8">
            <h2
              id="careers-principles-heading"
              className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              How people take part.
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
              Employment openings
            </span>
            <h2
              id="careers-openings-heading"
              className="mx-auto mt-4 max-w-2xl font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              No open roles posted right now.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              For current community learning and participation opportunities, visit the activities page. Any employment opportunity will be posted here when available.
            </p>
            <Link
              href="/activities"
              className="mx-auto mt-6 inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              See current activities
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
                Get involved in the community.
              </h2>
              <p className="text-sm text-navy-deep-foreground/70">
                Join a global network of people learning, building and growing together through technology.
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
