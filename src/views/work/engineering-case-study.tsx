import PageSeo from "@/components/seo/page-seo";
import type { PortfolioProject } from "@/constants/portfolio";
import { getPortfolioProject } from "@/constants/portfolio";
import LandingPageLayout from "@/layouts/landing-page";
import Link from "next/link";
import { FiArrowLeft, FiArrowUpRight, FiCheck, FiClock } from "react-icons/fi";

const EngineeringCaseStudyPage = ({ project }: { project: PortfolioProject }) => {
  const related = (project.relatedProjects ?? [])
    .map((slug) => getPortfolioProject(slug))
    .filter((item): item is PortfolioProject => Boolean(item));

  return (
    <LandingPageLayout>
      <PageSeo
        title={`${project.name} | Data Fellows`}
        description={project.summary}
        path={`/work/${project.slug}`}
      />
      <div className="space-y-16 pt-28 md:space-y-20 md:pt-32">
        <section className="px-4 sm:px-6" aria-labelledby="case-study-heading">
          <div className="mx-auto max-w-4xl space-y-6">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-muted-foreground hover:text-foreground"
            >
              <FiArrowLeft className="h-3.5 w-3.5" />
              Back to Work
            </Link>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">
              <span className="border border-border px-2 py-1">{project.projectOrigin}</span>
              <span className="border border-brand-blue-label px-2 py-1 text-brand-blue-label">
                {project.projectStatus}
              </span>
              {project.capabilities.map((capability) => (
                <span key={capability} className="border border-border px-2 py-1">
                  {capability}
                </span>
              ))}
            </div>

            <h1
              id="case-study-heading"
              className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-5xl"
            >
              {project.name}
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">{project.headline}</p>

            <div className="flex flex-wrap gap-x-8 gap-y-2 border-t border-border pt-4 font-mono text-xs uppercase tracking-wide text-muted-foreground">
              <span>{project.timePeriod}</span>
              <span>
                {project.contributors.map((c) => c.name).join(", ")}
              </span>
              {project.organization ? <span>{project.organization}</span> : null}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="case-study-problem">
          <div className="mx-auto max-w-4xl space-y-10">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                The problem
              </p>
              <h2 id="case-study-problem" className="sr-only">
                The problem
              </h2>
              <p className="mt-3 text-base leading-relaxed text-foreground">{project.problem}</p>
            </div>

            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                The approach
              </p>
              <p className="mt-3 text-base leading-relaxed text-foreground">{project.approach}</p>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="case-study-implementation">
          <div className="mx-auto max-w-4xl space-y-8 border border-border bg-muted/40 p-6 lg:p-10">
            <h2
              id="case-study-implementation"
              className="font-display text-xl font-semibold tracking-tight text-foreground"
            >
              Implementation
            </h2>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <FiCheck className="h-3.5 w-3.5" />
                  Implemented
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-foreground">
                  {project.implementedFeatures.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
              {project.plannedFeatures && project.plannedFeatures.length > 0 ? (
                <div>
                  <p className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <FiClock className="h-3.5 w-3.5" />
                    Not yet built
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                    {project.plannedFeatures.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-border pt-6 font-mono text-xs uppercase tracking-wide text-muted-foreground">
              {project.technologies.map((tech) => (
                <span key={tech} className="border border-border bg-background px-2 py-1">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {project.engineeringDecisions && project.engineeringDecisions.length > 0 ? (
          <section className="px-4 sm:px-6" aria-labelledby="case-study-decisions">
            <div className="mx-auto max-w-4xl space-y-6">
              <p className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Engineering decisions
              </p>
              <h2 id="case-study-decisions" className="sr-only">
                Engineering decisions
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {project.engineeringDecisions.map((decision) => (
                  <div key={decision.title} className="border border-border bg-background p-5">
                    <p className="font-display text-base font-semibold text-foreground">
                      {decision.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {decision.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="px-4 sm:px-6" aria-labelledby="case-study-results">
          <div className="mx-auto max-w-4xl space-y-6 border-l-2 border-brand-blue pl-5">
            <p className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Results and status
            </p>
            <h2 id="case-study-results" className="sr-only">
              Results and status
            </h2>
            <p className="text-base leading-relaxed text-foreground">{project.verifiedResults}</p>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="case-study-attribution">
          <div className="mx-auto max-w-4xl space-y-6">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Contributors &amp; attribution
              </p>
              <h2 id="case-study-attribution" className="sr-only">
                Contributors and attribution
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.attribution}</p>
              {project.upstreamProjects && project.upstreamProjects.length > 0 ? (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Built on:{" "}
                  {project.upstreamProjects.map((upstream, index) => (
                    <span key={upstream.href}>
                      {index > 0 ? ", " : ""}
                      <Link
                        href={upstream.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-foreground"
                      >
                        {upstream.label}
                      </Link>
                    </span>
                  ))}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-4">
              {project.sourceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-foreground/40"
                >
                  {link.label}
                  <FiArrowUpRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="px-4 sm:px-6" aria-labelledby="case-study-related">
            <div className="mx-auto max-w-4xl space-y-6">
              <h2
                id="case-study-related"
                className="font-display text-xl font-semibold tracking-tight text-foreground"
              >
                Related work
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/work/${item.slug}`}
                    className="group border border-border bg-background p-5 transition hover:border-foreground/40"
                  >
                    <p className="font-display text-base font-semibold text-foreground">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.headline}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="px-4 sm:px-6" aria-labelledby="case-study-cta">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 border border-foreground bg-background px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl space-y-2">
              <h2
                id="case-study-cta"
                className="font-display text-2xl font-semibold tracking-tight text-foreground"
              >
                Have a similar operational challenge?
              </h2>
              <p className="text-sm text-muted-foreground">
                Tell us what&apos;s happening and we&apos;ll tell you honestly whether it&apos;s
                something we can help with.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-foreground bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              Let&apos;s talk
              <FiArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
};

export default EngineeringCaseStudyPage;
