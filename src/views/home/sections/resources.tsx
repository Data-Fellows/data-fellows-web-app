import NewsletterModal from "@/components/custom/newsletter-modal";
import { journeySoFarUrl } from "@/constants/resources";
import type { Resource } from "@/types/resource";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { FiArrowRight, FiBookOpen, FiExternalLink } from "react-icons/fi";

const fetchResources = async () => {
  const response = await fetch("/api/resources");
  if (!response.ok) {
    throw new Error("Failed to load resources");
  }
  return (await response.json()) as { resources: Resource[] };
};

const formatDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${value}T00:00:00Z`))
    : "";

const getLinkProps = (href: string) =>
  href.startsWith("http")
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};

// Homepage preview of the resource library -- caps how much it shows (a
// featured story + up to 2 more, up to 3 guides/lessons) and links to the
// full, filterable /resources page rather than growing unbounded as more
// resources get added in the admin.
const MAX_STORY_HIGHLIGHTS = 2;
const MAX_GUIDE_LESSON_CARDS = 3;

const Resources = () => {
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const { data } = useQuery({
    queryKey: ["home-resources"],
    queryFn: fetchResources,
  });

  const resources = data?.resources ?? [];
  const stories = resources.filter((item) => item.category === "Story");
  const guidesAndLessons = resources
    .filter((item) => item.category !== "Story")
    .slice(0, MAX_GUIDE_LESSON_CARDS);

  const featuredStory = stories[0];
  const storyHighlights = stories.slice(1, 1 + MAX_STORY_HIGHLIGHTS);

  // Nothing published yet -- an empty "Resources" section with no cards
  // looks broken, not like a feature waiting for content.
  if (resources.length === 0) {
    return null;
  }

  return (
    <section
      id="resources"
      className="px-4 sm:px-6"
      aria-labelledby="resources-heading"
    >
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="space-y-4 text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Resources
          </span>
          <h2
            id="resources-heading"
            className="text-3xl font-semibold text-foreground sm:text-4xl"
          >
            Stories, guides, and highlights from Fellows.
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            Tap into the latest community-written spotlights plus the evergreen
            guides and lessons powering our pilots.
          </p>
        </div>

        {featuredStory ? (
          <div className="grid gap-8 lg:grid-cols-12">
            <article className="group overflow-hidden rounded-3xl border border-primary/10 bg-background lg:col-span-7">
              <div className="relative h-80">
                {/* eslint-disable-next-line @next/next/no-img-element -- admin-provided URLs (Supabase Storage uploads or arbitrary links), can't allowlist every domain for next/image */}
                <img
                  src={featuredStory.image_url || "/images/data-community-hero.jpg"}
                  alt={featuredStory.title}
                  className="absolute inset-0 h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary backdrop-blur">
                  <FiBookOpen className="h-3.5 w-3.5" />
                  Story
                </div>
                {featuredStory.published_date ? (
                  <div className="absolute bottom-4 left-4 rounded-full bg-background/90 px-4 py-1 text-xs uppercase tracking-wide text-muted-foreground backdrop-blur">
                    {formatDate(featuredStory.published_date)}
                  </div>
                ) : null}
              </div>
              <div className="space-y-4 px-6 py-6">
                <h3 className="text-2xl font-semibold text-foreground">
                  {featuredStory.title}
                </h3>
                {featuredStory.description ? (
                  <p className="text-sm text-muted-foreground">
                    {featuredStory.description}
                  </p>
                ) : null}
                <Link
                  href={featuredStory.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80"
                  {...getLinkProps(featuredStory.href)}
                >
                  Read the full story
                  <FiExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </article>

            <div className="space-y-4 lg:col-span-5">
              {storyHighlights.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-4 rounded-3xl border border-primary/10 bg-background p-4"
                >
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element -- admin-provided URLs (Supabase Storage uploads or arbitrary links), can't allowlist every domain for next/image */}
                    <img
                      src={item.image_url || "/images/data-community-hero.jpg"}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="space-y-2">
                    {item.published_date ? (
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {formatDate(item.published_date)}
                      </p>
                    ) : null}
                    <h3 className="text-base font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-primary"
                      {...getLinkProps(item.href)}
                    >
                      View highlight
                      <FiArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}

              <div className="rounded-3xl border border-primary/10 bg-primary/5 px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Journey so far
                </p>
                <h3 className="mt-2 text-lg font-semibold text-foreground">
                  Behind the success: a Fellow shares the build-up to launch.
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Listen to the monthly audio drop that unpacks the people,
                  prompts, and pivots behind each win.
                </p>
                <Link
                  href={journeySoFarUrl}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                  {...getLinkProps(journeySoFarUrl)}
                >
                  Listen & read recap
                  <FiArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <Link
                href="/resources"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
              >
                Check previous stories & highlights
                <FiExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : null}

        {guidesAndLessons.length > 0 ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-foreground">
                  Guides & lessons
                </h3>
                <p className="text-sm text-muted-foreground">
                  Each piece now ships with visuals so you can skim, save, and run
                  with it faster.
                </p>
              </div>
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                Browse all resources
                <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {guidesAndLessons.map((card) => (
                <article
                  key={card.id}
                  className="overflow-hidden rounded-3xl border border-primary/10 bg-background"
                >
                  <div className="relative h-48">
                    {/* eslint-disable-next-line @next/next/no-img-element -- admin-provided URLs (Supabase Storage uploads or arbitrary links), can't allowlist every domain for next/image */}
                    <img
                      src={card.image_url || "/images/data-community-hero.jpg"}
                      alt={card.title}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary backdrop-blur">
                      {card.category}
                    </span>
                  </div>
                  <div className="space-y-3 px-5 py-5">
                    {card.published_date ? (
                      <p className="text-xs text-muted-foreground">
                        {formatDate(card.published_date)}
                      </p>
                    ) : null}
                    <h3 className="text-lg font-semibold text-foreground">
                      {card.title}
                    </h3>
                    {card.description ? (
                      <p className="text-sm text-muted-foreground">
                        {card.description}
                      </p>
                    ) : null}
                    <Link
                      href={card.href}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                      {...getLinkProps(card.href)}
                    >
                      Continue reading
                      <FiExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        <div className="rounded-3xl border border-primary/10 bg-secondary/10 px-6 py-10 lg:flex lg:items-center lg:gap-10">
          <div className="space-y-4 lg:w-1/2">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Newsletter
            </span>
            <h3 className="text-2xl font-semibold text-foreground">
              Join the Community & Growth operations newsletter.
            </h3>
            <p className="text-sm text-muted-foreground">
              Every issue includes pilot recaps, hiring drops, and templates.
              Subscribe to get the same notes shared during Sunday catch-ups.
            </p>
            <p className="text-xs text-muted-foreground">
              Powered by MailerLite -- unsubscribe anytime.
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
      </div>
      <NewsletterModal
        isOpen={isNewsletterOpen}
        onClose={() => setIsNewsletterOpen(false)}
      />
    </section>
  );
};

export default Resources;
