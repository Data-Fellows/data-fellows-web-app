import PageSeo from "@/components/seo/page-seo";
import { site } from "@/constants/site";
import LandingPageLayout from "@/layouts/landing-page";
import StudioCredibility from "@/views/home/sections/studio-credibility";
import Link from "next/link";
import { FiArrowUpRight, FiCalendar } from "react-icons/fi";

const areas = [
  {
    title: "Software and product development",
    text: "Web applications, product experiments and technical prototypes grounded in a clear problem and user need.",
    href: "/work/hr-platform",
    label: "See software work",
  },
  {
    title: "Data systems and analytics",
    text: "Pipelines, data models, integrations and analytics systems that help people work with information more clearly.",
    href: "/work/ont-communities",
    label: "See data work",
  },
  {
    title: "AI, automation and integration",
    text: "Applied AI experiments, workflow automation and system integrations, scoped to a real use case and reviewed by people.",
    href: "/work",
    label: "Explore related projects",
  },
];

const StudioPage = () => (
  <LandingPageLayout>
    <PageSeo
      title="Data Fellows Studio | Technology and Collaboration"
      description="The Data Fellows Studio explores scoped software, data, AI and automation work with organizations and collaborators, backed by a global technology community."
      path="/studio"
    />
    <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
      <section className="px-4 sm:px-6" aria-labelledby="studio-hero-heading">
        <div className="mx-auto grid max-w-6xl gap-10 border border-border bg-muted/40 px-6 py-12 lg:grid-cols-12 lg:items-end lg:px-12 lg:py-16">
          <div className="space-y-5 lg:col-span-8">
            <p className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Data Fellows Studio
            </p>
            <h1 id="studio-hero-heading" className="max-w-4xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Technology work, built with people who care about the problem.
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              The Studio is Data Fellows&apos; path for scoped technology engagements and product experiments across software, data, AI, automation and systems integration. It brings practical project work alongside a global community built on learning and collaboration.
            </p>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Organizations can book a session to discuss paid technical work. Any engagement depends on fit and capacity, with scope, responsibilities and contributor compensation agreed before work begins.
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-4">
            <Link href="/book" className="inline-flex items-center justify-center gap-2 border border-brand-blue-fill bg-brand-blue-fill px-5 py-3 text-sm font-semibold text-brand-blue-foreground transition hover:bg-brand-blue-fill/90">
              <FiCalendar aria-hidden="true" className="h-4 w-4" />
              Book a Session
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-foreground px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-foreground hover:text-background">
              Contact the Studio
              <FiArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link href={site.studioUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary/80">
              Open the Studio prototype
              <FiArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <StudioCredibility />

      <section className="px-4 sm:px-6" aria-labelledby="studio-areas-heading">
        <div className="mx-auto max-w-6xl space-y-9">
          <div className="max-w-2xl space-y-3">
            <p className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">Areas of work</p>
            <h2 id="studio-areas-heading" className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              A practical place for technology collaboration.
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              The project archive shows what has been explored and who contributed. Each engagement is assessed for fit, scope, delivery capacity and a fair contributor plan before it proceeds.
            </p>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {areas.map((area) => (
              <article key={area.title} className="grid gap-4 py-6 sm:grid-cols-[minmax(12rem,0.6fr)_1fr_auto] sm:items-center sm:gap-8">
                <h3 className="font-display text-lg font-semibold text-foreground">{area.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{area.text}</p>
                <Link href={area.href} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                  {area.label}<FiArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6" aria-labelledby="studio-prototype-heading">
        <div className="mx-auto grid max-w-6xl gap-8 border border-border bg-background px-6 py-8 md:grid-cols-12 md:items-center lg:px-10">
          <div className="space-y-3 md:col-span-8">
            <p className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">Product experiment</p>
            <h2 id="studio-prototype-heading" className="font-display text-xl font-semibold text-foreground sm:text-2xl">A prototype for accountable delivery</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              The current Studio foundation is a synthetic prototype exploring organization-scoped projects, approved contributor assignments, bounded AI planning, independent review and client acceptance. It is not a production delivery system; real identity, persistent storage and model services remain to be built.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:col-span-4">
            <Link href={site.studioUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 border border-brand-blue-fill bg-brand-blue-fill px-5 py-3 text-sm font-semibold text-brand-blue-foreground transition hover:bg-brand-blue-fill/90">
              Visit Studio
              <FiArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link href="/work" className="inline-flex items-center justify-center gap-2 border border-border px-5 py-3 text-sm font-semibold text-foreground hover:border-foreground">
              Browse the project archive
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6" aria-labelledby="studio-community-heading">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 border border-brand-blue bg-navy-deep px-6 py-10 text-navy-deep-foreground sm:flex-row sm:items-center sm:justify-between lg:px-12">
          <div className="max-w-2xl space-y-2">
            <h2 id="studio-community-heading" className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">A Studio connected to a community.</h2>
            <p className="text-sm leading-6 text-navy-deep-foreground/75">
              Data Fellows is a community first. Members are not an on-demand workforce; anyone contributing to a paid project does so through clear, separately agreed terms and compensation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={site.communityUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center border border-navy-deep-foreground/25 px-5 py-3 text-sm font-semibold text-navy-deep-foreground hover:bg-navy-deep-foreground/10">Join the Community</Link>
            <Link href="/book" className="inline-flex items-center justify-center border border-brand-blue bg-brand-blue-fill px-5 py-3 text-sm font-semibold text-brand-blue-foreground hover:bg-brand-blue-fill/90">Book a Session</Link>
          </div>
        </div>
      </section>
    </div>
  </LandingPageLayout>
);

export default StudioPage;
