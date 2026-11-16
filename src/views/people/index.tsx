import PageSeo from "@/components/seo/page-seo";
import LandingPageLayout from "@/layouts/landing-page";
import {
  advisors,
  communityAdmins,
  foundingTeam,
} from "@/views/shared/team";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiArrowUpRight, FiLinkedin } from "react-icons/fi";

type Person = {
  name: string;
  role: string;
  tagline: string;
  image: string;
  linkedin?: string;
  featured?: boolean;
  objectPosition?: string;
};

const PersonCard = ({ person }: { person: Person }) => {
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();
  const { name, role, tagline, image, linkedin, objectPosition } = person;

  return (
    <div className="flex h-full flex-col overflow-hidden border border-border bg-background">
      <div className="relative h-72">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className="object-cover object-top grayscale"
          style={objectPosition ? { objectPosition } : undefined}
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-base font-semibold text-foreground">
              {name}
            </p>
            <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              {role}
            </p>
          </div>
          {linkedin ? (
            <Link
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center border border-border text-foreground transition hover:bg-foreground hover:text-background"
              aria-label={`LinkedIn profile of ${name}`}
            >
              <FiLinkedin className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">{tagline}</p>

        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          className="mt-auto flex items-center gap-2 pt-2 font-mono text-xs uppercase tracking-wide text-muted-foreground hover:text-foreground"
        >
          {expanded ? "Hide" : "More about"} {name.split(" ")[0]}
        </button>
        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              key="bio"
              initial={reduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduced ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <p className="border-l-2 border-brand-blue pl-3 pt-1 text-xs italic leading-relaxed text-muted-foreground">
                We're collecting {name.split(" ")[0]}&apos;s full story
                directly from the team -- how they joined, what they&apos;re
                working on day to day, and what led them here. This section
                will be filled in once that interview is done, rather than
                guessed at.
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

const PeoplePage = () => {
  return (
    <LandingPageLayout>
      <PageSeo
        title="People -- Data Fellows"
        description="Meet the people behind Data Fellows -- the founding team, community leadership, and advisors building technology and community together."
        path="/people"
      />
      <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
        <section className="px-4 sm:px-6" aria-labelledby="people-hero-heading">
          <div className="mx-auto max-w-6xl border border-border bg-muted/40 px-6 py-12 text-center lg:px-12">
            <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
              People
            </span>
            <h1
              id="people-hero-heading"
              className="mx-auto mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Meet the people behind the work.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Every person here codes, teaches, or builds alongside Fellows.
              Full biographies -- how each person joined, what they're
              working on, and the problem they care most about -- are being
              written up directly with the team and will fill in here over
              time.
            </p>
            <Link
              href="/contact"
              className="mx-auto mt-6 inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              Work With Us
              <FiArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="people-founding-heading">
          <div className="mx-auto max-w-6xl space-y-6">
            <h2
              id="people-founding-heading"
              className="font-display text-2xl font-semibold tracking-tight text-foreground"
            >
              Founding team
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {foundingTeam.map((person) => (
                <PersonCard key={person.name} person={person} />
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="people-community-heading">
          <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <h2
                id="people-community-heading"
                className="font-display text-2xl font-semibold tracking-tight text-foreground"
              >
                Community leadership
              </h2>
              <div
                className={`grid gap-6 ${communityAdmins.length > 1 ? "sm:grid-cols-2" : "max-w-xs"}`}
              >
                {communityAdmins.map((person) => (
                  <PersonCard key={person.name} person={person} />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                Advisors
              </h2>
              <div
                className={`grid gap-6 ${advisors.length > 1 ? "sm:grid-cols-2" : "max-w-xs"}`}
              >
                {advisors.map((person) => (
                  <PersonCard key={person.name} person={person} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="people-cta-heading">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 border border-brand-blue bg-navy-deep px-6 py-10 text-navy-deep-foreground sm:flex-row sm:items-center sm:justify-between lg:px-12">
            <div className="max-w-xl space-y-2">
              <h2
                id="people-cta-heading"
                className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                Want to build alongside this team?
              </h2>
              <p className="text-sm text-navy-deep-foreground/70">
                Join the community to meet people, or reach out directly if
                you have a problem worth solving together.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/community"
                className="inline-flex items-center gap-2 border border-navy-deep-foreground/20 px-6 py-3 text-sm font-semibold text-navy-deep-foreground transition hover:bg-navy-deep-foreground/10"
              >
                Join the Community
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-brand-blue bg-brand-blue px-6 py-3 text-sm font-semibold text-brand-blue-foreground transition hover:bg-brand-blue/90"
              >
                Work With Us
                <FiArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
};

export default PeoplePage;
