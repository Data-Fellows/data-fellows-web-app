import MetricBand from "@/components/custom/metric-band";
import Reveal from "@/components/custom/reveal";
import PageSeo from "@/components/seo/page-seo";
import { extendedStats, impactStats, site } from "@/constants/site";
import LandingPageLayout from "@/layouts/landing-page";
import Link from "next/link";
import { FiArrowUpRight, FiDownload } from "react-icons/fi";

const timeline = [
  {
    year: "2022",
    title: "Data Fellows begins",
    description:
      "A small community forms around one idea: learning data should lead to doing something real, not just watching tutorials.",
  },
  {
    year: "2023--2024",
    title: "Training partnerships take shape",
    description:
      "Structured learning pathways open up with DataCamp, Zummit Africa and Vatebra Academy, backed by peer accountability and mentorship.",
  },
  {
    year: "2025",
    title: "Scholarships and pilots scale",
    description:
      "900+ DataCamp scholarships awarded in the year, alongside a growing slate of ecosystem pilot projects and the first builds toward Inscend.",
  },
  {
    year: "2026",
    title: "Four years, measured",
    description:
      "1,600+ members across 33+ countries, 600+ more DataCamp scholarships, the Claude 101 Challenge, and the community's first four-year Impact Report.",
  },
] as const;

const ImpactPage = () => {
  return (
    <LandingPageLayout>
      <PageSeo
        title="Impact | Data Fellows"
        description="Four years of Data Fellows in numbers: members, countries, pilot projects, scholarships and what the community told us in the 2026 survey."
        path="/impact"
      />
      <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
        <section className="px-4 sm:px-6" aria-labelledby="impact-hero-heading">
          <div className="mx-auto max-w-6xl border border-brand-blue bg-navy-deep px-6 py-14 text-navy-deep-foreground lg:px-12 lg:py-20">
            <p className="font-mono text-xs font-medium uppercase tracking-wide text-brand-blue">
              2022 &mdash; 2026
            </p>
            <h1
              id="impact-hero-heading"
              className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl"
            >
              Four years of turning data into clarity.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-navy-deep-foreground/70">
              Partners, members and future collaborators shouldn&apos;t have to
              download a PDF to understand what Data Fellows has built. Here
              is the evidence, in one place.
            </p>
            <Link
              href={site.impactReportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 border border-brand-blue bg-brand-blue-fill px-6 py-3 text-sm font-semibold text-brand-blue-foreground transition hover:bg-brand-blue-fill/90"
            >
              Read the 2026 Impact Report
              <FiDownload className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="impact-glance-heading">
          <div className="mx-auto max-w-6xl space-y-4">
            <h2 id="impact-glance-heading" className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Scale, participation and proof.
            </h2>
            <MetricBand metrics={impactStats} className="mt-8" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {extendedStats.map((stat) => (
                <div
                  key={stat.label}
                  className="border border-border bg-muted/40 p-6"
                >
                  <div className="font-display text-2xl font-semibold text-foreground">
                    {stat.value}
                  </div>
                  <p className="mt-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="impact-timeline-heading">
          <div className="mx-auto max-w-4xl space-y-10">
            <h2 id="impact-timeline-heading" className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              How we got here.
            </h2>
            <ol className="space-y-6 border-l border-border pl-6">
              {timeline.map((item, index) => (
                <Reveal key={item.year} delay={index * 0.05}>
                  <li className="relative">
                    <span className="absolute -left-[1.95rem] top-1.5 h-3 w-3 border-2 border-foreground bg-background" />
                    <p className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {item.year}
                    </p>
                    <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="impact-survey-heading">
          <div className="mx-auto max-w-6xl border border-border bg-muted/40 px-6 py-12 lg:px-12">
            <h2 id="impact-survey-heading" className="max-w-2xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              What members told us.
            </h2>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
              In the 2026 community survey, members asked for more job
              opportunities, peer study groups, live events, stronger
              discipline groups, physical meetups and more follow-up with
              past cohorts. The roadmap follows this feedback.
            </p>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="impact-cta-heading">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 border border-border bg-background px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-12">
            <div className="max-w-xl space-y-2">
              <h2 id="impact-cta-heading" className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Want the full picture?
              </h2>
              <p className="text-sm text-muted-foreground">
                The complete Impact Report covers the community, our
                programs, Inscend and what&apos;s ahead.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={site.impactReportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
              >
                Read the 2026 Impact Report
                <FiDownload className="h-4 w-4" />
              </Link>
              <Link
                href="/partners"
                className="inline-flex items-center gap-2 border border-foreground px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-foreground hover:text-background"
              >
                Partner with us
                <FiArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
};

export default ImpactPage;
