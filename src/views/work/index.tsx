import ProductSlideshow from "@/components/custom/product-slideshow";
import Reveal from "@/components/custom/reveal";
import PageSeo from "@/components/seo/page-seo";
import { portfolioProjects, type ProjectOrigin } from "@/constants/portfolio";
import { products } from "@/constants/products";
import LandingPageLayout from "@/layouts/landing-page";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";

const originOrder: ProjectOrigin[] = [
  "Independent project",
  "Open-source contribution",
  "Individual professional experience",
  "Research and experiment",
];

const capabilityFilters = ["All", "Software", "Data", "AI"] as const;
type CapabilityFilter = (typeof capabilityFilters)[number];

const WorkPage = () => {
  const [filter, setFilter] = useState<CapabilityFilter>("All");

  const visible = useMemo(
    () =>
      filter === "All"
        ? products
        : products.filter((product) => product.capabilities.includes(filter)),
    [filter]
  );

  return (
    <LandingPageLayout>
      <PageSeo
        title="Work | Data Fellows"
        description="Explore Data Fellows product experiments, community initiatives, independent engineering projects, research and open-source contributions across data, AI and software."
        path="/work"
      />
      <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
        <section className="px-4 sm:px-6" aria-labelledby="work-hero-heading">
          <div className="mx-auto max-w-6xl border border-border bg-muted/40 px-6 py-12 text-center lg:px-12">
            <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Work
            </span>
            <h1
              id="work-hero-heading"
              className="mx-auto mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Technology takes many forms here.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              This archive brings together Data Fellows product explorations, community initiatives, independent projects, research and open-source contributions. Each entry identifies who built it and the context in which it was created.
            </p>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="work-list-heading">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="space-y-2">
              <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Historical product explorations
              </span>
              <h2
                id="work-list-heading"
                className="font-display text-2xl font-semibold tracking-tight text-foreground"
              >
                Experiments in product development
              </h2>
            </div>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter by capability"
            >
              {capabilityFilters.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  aria-pressed={filter === option}
                  className={`border px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wide transition ${
                    filter === option
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-muted-foreground hover:border-foreground/40"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {visible.map((product, index) => (
                <Reveal key={product.key} delay={index * 0.08}>
                <article
                  className="flex h-full flex-col gap-5 border border-border bg-background p-6"
                >
                  <ProductSlideshow slides={product.slides} />
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    <span className="border border-border px-2 py-1">
                      {product.workType}
                    </span>
                    <span className="border border-brand-blue-label px-2 py-1 text-brand-blue-label">
                      Status: {product.stage}
                    </span>
                    {product.capabilities.map((capability) => (
                      <span key={capability} className="border border-border px-2 py-1">
                        {capability}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {product.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {product.goal}
                    </p>
                  </div>
                  <Link
                    href={`/work/${product.key}`}
                    className="mt-auto inline-flex items-center gap-2 border border-foreground px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-foreground hover:text-background"
                  >
                    View case study
                    <FiArrowUpRight className="h-4 w-4" />
                  </Link>
                </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="work-individual-heading">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="space-y-2">
              <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Individual projects & open-source
              </span>
              <h2
                id="work-individual-heading"
                className="font-display text-2xl font-semibold tracking-tight text-foreground"
              >
                What individual Fellows build on their own
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Independent projects, open-source tools and professional
                background from across the team -- each one is a person&apos;s
                own work, not automatically work owned by Data Fellows. See whose
                professional background connects to which company on the{" "}
                <Link href="/people" className="underline hover:text-foreground">
                  People page
                </Link>
                .
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {originOrder.flatMap((origin) =>
                portfolioProjects
                  .filter((project) => project.projectOrigin === origin)
                  .map((project, index) => (
                    <Reveal key={project.slug} delay={index * 0.06}>
                      <article className="flex h-full flex-col gap-4 border border-border bg-background p-6">
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
                        <div className="space-y-2">
                          <h3 className="font-display text-lg font-semibold text-foreground">
                            {project.name}
                          </h3>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {project.headline}
                          </p>
                        </div>
                        <Link
                          href={`/work/${project.slug}`}
                          className="mt-auto inline-flex items-center gap-2 border border-foreground px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-foreground hover:text-background"
                        >
                          View case study
                          <FiArrowUpRight className="h-4 w-4" />
                        </Link>
                      </article>
                    </Reveal>
                  ))
              )}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="work-other-heading">
          <h2 id="work-other-heading" className="sr-only">
            Community and collaboration
          </h2>
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            <div className="space-y-3 border border-border bg-background p-6">
              <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Community initiatives & impact
              </span>
              <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
                What the Data Fellows community has built together
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Learning initiatives, mentorship, community events and technical collaborations form part of Data Fellows&apos; history. The impact report documents these alongside the community&apos;s growth.
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                <Link
                  href="/community"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:underline"
                >
                  Visit the community
                  <FiArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/impact-report"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:underline"
                >
                  Read the Impact Report
                  <FiArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="space-y-3 border border-dashed border-border bg-muted/40 p-6">
              <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
                External collaborations
              </span>
              <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
                Attribution comes first
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Projects involving organizations or community members are shown only when the relationship and permission to share are clear. This archive does not claim that individual projects were Data Fellows client work.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="work-cta-heading">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 border border-brand-blue bg-navy-deep px-6 py-10 text-navy-deep-foreground sm:flex-row sm:items-center sm:justify-between lg:px-12">
            <div className="max-w-xl space-y-2">
              <h2
                id="work-cta-heading"
                className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                Interested in building together?
              </h2>
              <p className="text-sm text-navy-deep-foreground/70">
                Explore the community, projects and possible collaboration areas.
              </p>
            </div>
            <Link
              href="/community"
              className="inline-flex items-center gap-2 border border-brand-blue bg-brand-blue-fill px-6 py-3 text-sm font-semibold text-brand-blue-foreground transition hover:bg-brand-blue-fill/90"
            >
              Get involved
              <FiArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
};

export default WorkPage;
