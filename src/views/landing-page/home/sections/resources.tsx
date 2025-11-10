import NewsletterModal from "@/components/newsletter-modal";
import {
  guides,
  journeySoFarUrl,
  lessons,
  storySpotlights,
} from "@/constants/resources";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiArrowRight, FiBookOpen, FiExternalLink } from "react-icons/fi";

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(value))
    : "";

const getLinkProps = (href: string) =>
  href.startsWith("http")
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};

const Resources = () => {
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const featuredStory = storySpotlights[0];
  const storyHighlights = storySpotlights.slice(1);
  const guideAndLessonCards = [...guides, ...lessons];

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

        <div className="grid gap-8 lg:grid-cols-12">
          {featuredStory && (
            <article className="group overflow-hidden rounded-3xl border border-primary/10 bg-background lg:col-span-7">
              <div className="relative h-80">
                <Image
                  src={featuredStory.image}
                  alt={featuredStory.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-top transition duration-500 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary backdrop-blur">
                  <FiBookOpen className="h-3.5 w-3.5" />
                  {featuredStory.category ?? "Feature spotlight"}
                </div>
                <div className="absolute bottom-4 left-4 rounded-full bg-background/90 px-4 py-1 text-xs uppercase tracking-wide text-muted-foreground backdrop-blur">
                  {formatDate(featuredStory.date)}
                </div>
              </div>
              <div className="space-y-4 px-6 py-6">
                <h3 className="text-2xl font-semibold text-foreground">
                  {featuredStory.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {featuredStory.description}
                </p>
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
          )}

          <div className="space-y-4 lg:col-span-5">
            {storyHighlights.map((item) => (
              <article
                key={item.title}
                className="flex gap-4 rounded-3xl border border-primary/10 bg-background p-4"
              >
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="96px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {formatDate(item.date)}
                  </p>
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
              href="/resources#stories-heading"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
            >
              Check previous stories & highlights
              <FiExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>

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
            {guideAndLessonCards.map((card) => (
              <article
                key={card.title}
                className="overflow-hidden rounded-3xl border border-primary/10 bg-background"
              >
                <div className="relative h-48">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-top"
                  />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary backdrop-blur">
                    {card.category}
                  </span>
                </div>
                <div className="space-y-3 px-5 py-5">
                  {card.date && (
                    <p className="text-xs text-muted-foreground">
                      {formatDate(card.date)}
                    </p>
                  )}
                  <h3 className="text-lg font-semibold text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
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
