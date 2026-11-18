import Highlight from "@/components/custom/highlight";
import ProductSlideshow from "@/components/custom/product-slideshow";
import Reveal from "@/components/custom/reveal";
import PageSeo from "@/components/seo/page-seo";
import { products } from "@/constants/products";
import LandingPageLayout from "@/layouts/landing-page";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";

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
        description="In-house products, individual professional experience, engineering demonstrations, community initiatives, and future client engagements from Data Fellows, labeled honestly by stage and capability."
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
              Five different kinds of work, kept <Highlight>honestly distinct</Highlight>.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              In-house products, individual professional experience,
              engineering demonstrations, community initiatives, and
              commercial client engagements aren't the same kind of work, so
              we don't present them as if they were. As client engagements go
              through a real scoping process and get permission to be shown
              publicly, they'll be added below.
            </p>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="work-list-heading">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="space-y-2">
              <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
                In-house products
              </span>
              <h2
                id="work-list-heading"
                className="font-display text-2xl font-semibold tracking-tight text-foreground"
              >
                Our own product explorations
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

        <section className="px-4 sm:px-6" aria-labelledby="work-experience-heading">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            <div className="space-y-3 border border-border bg-background p-6">
              <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Individual professional experience
              </span>
              <h2
                id="work-experience-heading"
                className="font-display text-xl font-semibold tracking-tight text-foreground"
              >
                Backgrounds our team brings with them
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Several Fellows bring direct experience from PwC, Cohere and
                Andela, spanning enterprise consulting, software engineering,
                data infrastructure and AI. That's each person's own
                professional history, not a Data Fellows client engagement --
                see whose background connects to which company on the People
                page.
              </p>
              <Link
                href="/people"
                className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:underline"
              >
                Meet the people behind the work
                <FiArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-3 border border-border bg-background p-6">
              <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Engineering demonstrations & research
              </span>
              <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
                Technical experiments outside client work
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Individual engineers on the team also build and publish their
                own technical experiments, from systems tooling to AI
                evaluation projects, outside of anything commissioned by a
                client. Their public profiles are the source for specifics.
              </p>
              <Link
                href="/people"
                className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:underline"
              >
                See individual profiles
                <FiArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-3 border border-border bg-background p-6">
              <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Community initiatives & impact
              </span>
              <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
                What the Data Fellows community has built together
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Learning sprints, mentorship circles and ecosystem pilots
                across 1,600+ members in 33+ countries, documented in our
                annual impact report rather than repeated here.
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
                Commercial client engagements
              </span>
              <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
                None published yet
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We don't have a client engagement we can show publicly yet.
                As that changes, with a real scoping process behind each one
                and the client's permission to be named, engagements will
                appear here rather than anywhere else on the site.
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
                Have a similar problem?
              </h2>
              <p className="text-sm text-navy-deep-foreground/70">
                Tell us what&apos;s happening and we&apos;ll tell you honestly
                whether it&apos;s something we can help with.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-brand-blue bg-brand-blue-fill px-6 py-3 text-sm font-semibold text-brand-blue-foreground transition hover:bg-brand-blue-fill/90"
            >
              Discuss a Project
              <FiArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
};

export default WorkPage;
