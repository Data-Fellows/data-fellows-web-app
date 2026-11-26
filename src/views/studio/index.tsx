import PageSeo from "@/components/seo/page-seo";
import { site } from "@/constants/site";
import LandingPageLayout from "@/layouts/landing-page";
import StudioCredibility from "@/views/home/sections/studio-credibility";
import Link from "next/link";
import { FiArrowUpRight, FiCalendar } from "react-icons/fi";

const areas = [
  {
    title: "Software and product development",
    text: "Web applications and internal tools designed around the needs of the people who use them.",
    href: "/work/hr-platform",
    label: "See software work",
  },
  {
    title: "Data systems and analytics",
    text: "Data pipelines and models that make complex information easier to explore and use.",
    href: "/work/ont-communities",
    label: "See data work",
  },
  {
    title: "AI, automation and integration",
    text: "AI features, workflow automation and system integrations built for practical day-to-day use.",
    href: "/work",
    label: "Explore related projects",
  },
];

const StudioPage = () => (
  <LandingPageLayout>
    <PageSeo
      title="Data Fellows Studio | Software, Data and AI"
      description="Data Fellows Studio helps organizations plan and build software, data systems and AI tools. Book a session to talk through your project."
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
              We build software, data systems and AI.
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Data Fellows Studio works with organizations to solve practical problems with software, data and AI. Our work includes custom applications, analytics, automation and integrations.
            </p>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Have a project in mind? Book a session and tell us what you&apos;re working through. We can discuss the right approach, scope, cost and timeline together.
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
            <Link href={site.studioUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:border-foreground">
              Visit the Studio
              <FiArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <StudioCredibility />

      <section className="px-4 sm:px-6" aria-labelledby="studio-areas-heading">
        <div className="mx-auto max-w-6xl space-y-9">
          <div className="max-w-2xl space-y-3">
            <p className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">What we work on</p>
            <h2 id="studio-areas-heading" className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              What we can help you build.
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              From a first conversation to a working system, we bring the right technical skills to each project. Here are examples of related work.
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

      <section className="px-4 sm:px-6" aria-labelledby="studio-community-heading">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 border border-brand-blue bg-navy-deep px-6 py-10 text-navy-deep-foreground sm:flex-row sm:items-center sm:justify-between lg:px-12">
          <div className="max-w-2xl space-y-2">
            <h2 id="studio-community-heading" className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Built with people who care about the work.</h2>
            <p className="text-sm leading-6 text-navy-deep-foreground/75">
              Data Fellows is home to a global community of people working across data, AI and software. For each project, we bring in the skills it needs and agree on roles and compensation before work begins.
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
