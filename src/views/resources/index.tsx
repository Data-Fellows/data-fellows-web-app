import NewsletterModal from "@/components/custom/newsletter-modal";
import PageSeo from "@/components/seo/page-seo";
import { journeySoFarUrl } from "@/constants/resources";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import LandingPageLayout from "@/layouts/landing-page";
import type { Resource, ResourceCategory } from "@/types/resource";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FiArrowRight,
  FiBookmark,
  FiDownload,
  FiExternalLink,
  FiHeadphones,
  FiPenTool,
} from "react-icons/fi";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));

const typeIcon: Record<ResourceCategory, typeof FiPenTool> = {
  Story: FiPenTool,
  Guide: FiBookmark,
  Lesson: FiHeadphones,
};

const filters = ["All", "Story", "Guide", "Lesson"] as const;
const filterLabels: Record<(typeof filters)[number], string> = {
  All: "All",
  Story: "Stories",
  Guide: "Guides",
  Lesson: "Lessons",
};

const FALLBACK_IMAGE = "/images/data-community-hero.jpg";

type ResourcesPageProps = {
  resources: Resource[];
};

const ResourcesPage = ({ resources }: ResourcesPageProps) => {
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]>("All");

  const visibleResources = useMemo(
    () =>
      activeFilter === "All"
        ? resources
        : resources.filter((item) => item.category === activeFilter),
    [resources, activeFilter]
  );

  return (
    <LandingPageLayout>
      <PageSeo
        title="Resources -- Data Fellows"
        description="Guides, lessons, and story spotlights from the Data Fellows community -- practical resources for learning data and AI skills."
        path="/resources"
      />
      <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
        <section
          className="px-4 sm:px-6"
          aria-labelledby="resources-hero-heading"
        >
          <div className="mx-auto max-w-6xl border border-border bg-muted/40 px-6 py-12 lg:px-12">
            <div className="space-y-6 text-center">
              <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Insights
              </span>
              <h1
                id="resources-hero-heading"
                className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              >
                Stories and lessons from real people building with data.
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
                Dive into the guides, reflections, and conversations coming out
                of the Data Fellows ecosystem. Each piece is meant to be
                practical enough to use tomorrow.
              </p>
              <button
                type="button"
                onClick={() => setIsNewsletterOpen(true)}
                className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                Subscribe to the newsletter
                <FiArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <section
          className="px-4 sm:px-6"
          aria-labelledby="impact-report-heading"
        >
          <div className="mx-auto max-w-6xl border border-brand-blue bg-navy-deep px-6 py-10 text-navy-deep-foreground lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-12">
            <div className="space-y-3">
              <span className="font-mono text-xs font-medium uppercase tracking-wide text-brand-blue">
                Four-year anniversary
              </span>
              <h2
                id="impact-report-heading"
                className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                The Data Fellows Impact Report is here.
              </h2>
              <p className="max-w-2xl text-sm text-navy-deep-foreground/70">
                Four years of turning data into clarity, across 33 countries.
                See the full story: our community, our programs, Inscend, and
                what's ahead.
              </p>
            </div>
            <Link
              href="/documents/data-fellows-impact-report-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 border border-brand-blue bg-brand-blue-fill px-6 py-3 text-sm font-semibold text-brand-blue-foreground transition hover:bg-brand-blue-fill/90 lg:mt-0"
            >
              Read the 2026 Impact Report
              <FiDownload className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="browse-heading">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  id="browse-heading"
                  className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
                >
                  Browse resources
                </h2>
                <p className="text-sm text-muted-foreground">
                  Filter by format to find what&apos;s useful right now.
                </p>
              </div>
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Filter resources by type"
              >
                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    aria-pressed={activeFilter === filter}
                    className={`border px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                      activeFilter === filter
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-muted-foreground hover:border-foreground/40"
                    }`}
                  >
                    {filterLabels[filter]}
                  </button>
                ))}
              </div>
            </div>

            {visibleResources.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visibleResources.map((item) => {
                  const Icon = typeIcon[item.category];
                  return (
                    <article
                      key={item.id}
                      className="overflow-hidden border border-border bg-background"
                    >
                      <div className="relative h-48">
                        {/* eslint-disable-next-line @next/next/no-img-element -- admin-provided URLs (Supabase Storage uploads or arbitrary links), can't allowlist every domain for next/image */}
                        <img
                          src={item.image_url || FALLBACK_IMAGE}
                          alt={item.title}
                          className="absolute inset-0 h-full w-full object-cover object-top"
                        />
                        <span className="absolute left-4 top-4 inline-flex items-center gap-2 border border-border bg-background/90 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wide text-foreground backdrop-blur">
                          <Icon className="h-3.5 w-3.5" />
                          {item.category}
                        </span>
                      </div>
                      <div className="space-y-3 px-6 py-6">
                        {item.published_date ? (
                          <p className="font-mono text-xs text-muted-foreground">
                            {formatDate(item.published_date)}
                          </p>
                        ) : null}
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          {item.title}
                        </h3>
                        {item.description ? (
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        ) : null}
                        <Link
                          href={item.href}
                          target={
                            item.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            item.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground"
                        >
                          Open
                          <FiExternalLink className="h-4 w-4" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="border border-border bg-muted/40 px-6 py-10 text-center text-sm text-muted-foreground">
                {resources.length === 0
                  ? "No resources yet -- check back soon."
                  : `No ${filterLabels[activeFilter].toLowerCase()} yet -- check back soon.`}
              </p>
            )}
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="newsletter-heading">
          <div className="mx-auto max-w-6xl border border-border bg-muted/40 px-6 py-12 lg:flex lg:items-center lg:gap-12">
            <div className="space-y-4 lg:w-1/2">
              <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Newsletter
              </span>
              <h2
                id="newsletter-heading"
                className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              >
                Subscribe for Community & Growth ops updates.
              </h2>
              <p className="text-sm text-muted-foreground">
                Get the fortnightly digest with pilot experiments, product
                drops, and templates straight from Discord recaps.
              </p>
              <p className="text-xs text-muted-foreground">
                No spam. Just practical notes you can share with your team.
              </p>
            </div>
            <div className="mt-8 w-full lg:mt-0 lg:w-1/2">
              <button
                type="button"
                onClick={() => setIsNewsletterOpen(true)}
                className="inline-flex w-full items-center justify-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                Subscribe to the newsletter
                <FiArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="podcast-heading">
          <div className="mx-auto max-w-6xl border border-border bg-background px-6 py-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <h2
                  id="podcast-heading"
                  className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
                >
                  Journey So Far -- our monthly audio stories
                </h2>
                <p className="text-sm text-muted-foreground">
                  Listen to Fellows share what they are building, the setbacks
                  they faced, and how the community helped them move forward.
                </p>
              </div>
              <Link
                href={journeySoFarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-foreground px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-foreground hover:text-background"
              >
                Listen to the latest episode
                <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
      <NewsletterModal
        isOpen={isNewsletterOpen}
        onClose={() => setIsNewsletterOpen(false)}
      />
    </LandingPageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<
  ResourcesPageProps
> = async ({ req, res }) => {
  const supabase = createSupabaseServerClient({ req, res });
  if (!supabase) {
    return { props: { resources: [] } };
  }

  const { data, error } = await supabase
    .from("resources")
    .select("id, title, description, category, href, image_url, published_date, status, created_at, updated_at")
    .eq("status", "published")
    .order("published_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[resources] failed to load resources:", error);
  }

  return { props: { resources: data ?? [] } };
};

export default ResourcesPage;
