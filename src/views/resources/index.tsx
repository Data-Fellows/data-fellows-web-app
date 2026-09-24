import NewsletterModal from "@/components/custom/newsletter-modal";
import PageSeo from "@/components/seo/page-seo";
import {
  guides,
  journeySoFarUrl,
  lessons,
  storySpotlights,
} from "@/constants/resources";
import LandingPageLayout from "@/layouts/landing-page";
import Image from "next/image";
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
  }).format(new Date(value));

type ResourceCard = {
  type: "Story" | "Guide" | "Lesson";
  title: string;
  description: string;
  image: string;
  href: string;
  date?: string;
};

const typeIcon = {
  Story: FiPenTool,
  Guide: FiBookmark,
  Lesson: FiHeadphones,
} as const;

const filters = ["All", "Story", "Guide", "Lesson"] as const;
const filterLabels: Record<(typeof filters)[number], string> = {
  All: "All",
  Story: "Stories",
  Guide: "Guides",
  Lesson: "Lessons",
};

const ResourcesPage = () => {
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]>("All");

  const allResources: ResourceCard[] = useMemo(
    () => [
      ...storySpotlights.map((item) => ({
        type: "Story" as const,
        title: item.title,
        description: item.description,
        image: item.image,
        href: item.href,
        date: item.date,
      })),
      ...guides.map((item) => ({
        type: "Guide" as const,
        title: item.title,
        description: item.description,
        image: item.image,
        href: item.href,
        date: item.date,
      })),
      ...lessons.map((item) => ({
        type: "Lesson" as const,
        title: item.title,
        description: item.description,
        image: item.image,
        href: item.href,
        date: item.date,
      })),
    ],
    []
  );

  const visibleResources =
    activeFilter === "All"
      ? allResources
      : allResources.filter((item) => item.type === activeFilter);

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
          <div className="mx-auto max-w-6xl rounded-3xl border border-primary/10 bg-secondary/10 px-6 py-12 lg:px-12">
            <div className="space-y-6 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                Resources
              </span>
              <h1
                id="resources-hero-heading"
                className="text-3xl font-semibold text-foreground sm:text-4xl"
              >
                Stories and lessons from real people building with data.
              </h1>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground">
                Dive into the guides, reflections, and conversations coming out
                of the Data Fellows ecosystem. Each piece is meant to be
                practical enough to use tomorrow.
              </p>
              <button
                type="button"
                onClick={() => setIsNewsletterOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
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
          <div className="mx-auto max-w-6xl rounded-3xl border border-primary/10 bg-primary/10 px-6 py-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-12">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                Four-year anniversary
              </span>
              <h2
                id="impact-report-heading"
                className="text-2xl font-semibold text-foreground sm:text-3xl"
              >
                The Data Fellows Impact Report is here.
              </h2>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Four years of turning data into clarity, across 33 countries.
                See the full story: our community, our programs, Inscend, and
                what's ahead.
              </p>
            </div>
            <Link
              href="/documents/data-fellows-impact-report-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 lg:mt-0"
            >
              Read the Impact Report
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
                  className="text-3xl font-semibold text-foreground sm:text-4xl"
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
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                      activeFilter === filter
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-primary/20 bg-background text-muted-foreground hover:border-primary/40"
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
                  const Icon = typeIcon[item.type];
                  return (
                    <article
                      key={item.title}
                      className="overflow-hidden rounded-3xl border border-primary/10 bg-background"
                    >
                      <div className="relative h-48">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover object-top"
                        />
                        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary backdrop-blur">
                          <Icon className="h-3.5 w-3.5" />
                          {item.type}
                        </span>
                      </div>
                      <div className="space-y-3 px-6 py-6">
                        {item.date ? (
                          <p className="text-xs text-muted-foreground">
                            {formatDate(item.date)}
                          </p>
                        ) : null}
                        <h3 className="text-lg font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
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
                          className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
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
              <p className="rounded-3xl border border-primary/10 bg-secondary/10 px-6 py-10 text-center text-sm text-muted-foreground">
                No {filterLabels[activeFilter].toLowerCase()} yet -- check back
                soon.
              </p>
            )}

            <div className="rounded-3xl border border-primary/10 bg-background px-6 py-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Journey so far
                  </p>
                  <h3 className="text-2xl font-semibold text-foreground">
                    Behind the scenes of a Fellow&apos;s success story.
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get to know the prompts, pivots, and partnerships that made
                    the launch possible.
                  </p>
                </div>
                <Link
                  href={journeySoFarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary"
                >
                  Listen to latest
                  <FiHeadphones className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="newsletter-heading">
          <div className="mx-auto max-w-6xl rounded-3xl border border-primary/10 bg-secondary/10 px-6 py-12 lg:flex lg:items-center lg:gap-12">
            <div className="space-y-4 lg:w-1/2">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                Newsletter
              </span>
              <h2
                id="newsletter-heading"
                className="text-3xl font-semibold text-foreground sm:text-4xl"
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
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Subscribe to the newsletter
                <FiArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="podcast-heading">
          <div className="mx-auto max-w-6xl rounded-3xl border border-primary/10 bg-background px-6 py-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <h2
                  id="podcast-heading"
                  className="text-2xl font-semibold text-foreground sm:text-3xl"
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
                className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
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

export default ResourcesPage;
