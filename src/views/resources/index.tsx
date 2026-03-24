import NewsletterModal from "@/components/custom/newsletter-modal";
import {
  guides,
  journeySoFarUrl,
  lessons,
  storySpotlights,
} from "@/constants/resources";
import LandingPageLayout from "@/layouts/landing-page";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FiArrowRight,
  FiBookmark,
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

const ResourcesPage = () => {
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  return (
    <LandingPageLayout>
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

        <section className="px-4 sm:px-6" aria-labelledby="stories-heading">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  id="stories-heading"
                  className="text-3xl font-semibold text-foreground sm:text-4xl"
                >
                  Feature spotlights
                </h2>
                <p className="text-sm text-muted-foreground">
                  Community-written articles that now ship with imagery and
                  timestamps.
                </p>
              </div>
              {/* <Link
                href="#"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                View archive
                <FiExternalLink className="h-4 w-4" />
              </Link> */}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {storySpotlights.map((story) => (
                <article
                  key={story.title}
                  className="overflow-hidden rounded-3xl border border-primary/10 bg-background"
                >
                  <div className="relative h-80">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-top"
                    />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                      <FiPenTool className="h-3.5 w-3.5" />
                      Story
                    </span>
                    <span className="absolute bottom-4 left-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {formatDate(story.date)}
                    </span>
                  </div>
                  <div className="space-y-3 px-6 py-6">
                    <h3 className="text-xl font-semibold text-foreground">
                      {story.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {story.description}
                    </p>
                    <Link
                      href={story.href}
                      target={
                        story.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        story.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                    >
                      Read story
                      <FiExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <div className="rounded-3xl border border-primary/10 bg-background px-6 py-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Journey so far
                  </p>
                  <h3 className="text-2xl font-semibold text-foreground">
                    Behind the scenes of a Fellow's success story.
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

        <section
          className="px-4 sm:px-6"
          aria-labelledby="guides-lessons-heading"
        >
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="text-center">
              <h2
                id="guides-lessons-heading"
                className="text-3xl font-semibold text-foreground sm:text-4xl"
              >
                Guides & lessons library
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
                Every entry now pairs a short write-up with a visual preview so
                you can quickly see if it is relevant.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { label: "Guide", icon: FiBookmark, data: guides },
                { label: "Lesson", icon: FiHeadphones, data: lessons },
              ].map(({ label, icon: Icon, data }) => (
                <div
                  key={label}
                  className="space-y-4 rounded-3xl border border-primary/10 bg-background px-6 py-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {label}s
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {label === "Guide"
                          ? "Actionable playbooks built with partners."
                          : "Lessons straight from recent pilots."}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {data.map((item) => (
                      <article
                        key={item.title}
                        className="flex gap-4 rounded-2xl border border-primary/10 bg-secondary/10 p-4"
                      >
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-foreground">
                            {item.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                          <Link
                            href={item.href}
                            target={
                              item.href.startsWith("http")
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              item.href.startsWith("http")
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="inline-flex items-center gap-2 text-xs font-semibold text-primary"
                          >
                            Open
                            <FiArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
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
