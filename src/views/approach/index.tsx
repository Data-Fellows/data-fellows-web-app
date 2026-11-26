import PageSeo from "@/components/seo/page-seo";
import LandingPageLayout from "@/layouts/landing-page";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

const principles = [
  {
    title: "Start with people",
    description:
      "Learning and building begin with the people involved: their experience, questions, goals and ways of working.",
  },
  {
    title: "Share what we learn",
    description:
      "Community conversations, workshops and member stories make knowledge easier to exchange and build on.",
  },
  {
    title: "Learn by building",
    description:
      "Members develop their skills through software, data, AI and research projects.",
  },
  {
    title: "Collaborate with care",
    description:
      "Participation is based on shared interest and clear expectations. Community members are not assumed to be employees or an on-demand workforce.",
  },
];

const ApproachPage = () => (
  <LandingPageLayout>
    <PageSeo
      title="How We Work Together | Data Fellows"
      description="Learn how Data Fellows brings people together to exchange knowledge, develop skills and explore technology through community."
      path="/approach"
    />
    <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
      <section className="px-4 sm:px-6" aria-labelledby="approach-hero-heading">
        <div className="mx-auto max-w-6xl border border-border bg-muted/40 px-6 py-12 lg:px-12 lg:py-16">
          <p className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
            How we work together
          </p>
          <h1
            id="approach-hero-heading"
            className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-5xl"
          >
            A community for learning, building and exchange.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            People learn by asking questions, sharing what they know and working on real projects. Data Fellows brings people together through learning, mentorship, technical work and conversation.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6" aria-labelledby="approach-principles-heading">
        <div className="mx-auto max-w-6xl space-y-8">
          <h2
            id="approach-principles-heading"
            className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            What guides us
          </h2>
          <div className="divide-y divide-border border-y border-border">
            {principles.map((item) => (
              <article key={item.title} className="grid gap-3 py-6 sm:grid-cols-[minmax(12rem,0.65fr)_1fr] sm:gap-8">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6" aria-labelledby="approach-cta-heading">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 border border-brand-blue bg-navy-deep px-6 py-10 text-navy-deep-foreground sm:flex-row sm:items-center sm:justify-between lg:px-12">
          <div className="max-w-xl space-y-2">
            <h2 id="approach-cta-heading" className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Find your place in Data Fellows.
            </h2>
            <p className="text-sm text-navy-deep-foreground/75">
              Explore current activities, technical work and ways to connect with the community.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/community" className="inline-flex items-center gap-2 border border-brand-blue bg-brand-blue-fill px-5 py-2.5 text-sm font-semibold text-brand-blue-foreground hover:bg-brand-blue-fill/90">
              Explore the community
            </Link>
            <Link href="/work" className="inline-flex items-center gap-2 border border-navy-deep-foreground/25 px-5 py-2.5 text-sm font-semibold text-navy-deep-foreground hover:bg-navy-deep-foreground/10">
              Browse projects
              <FiArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  </LandingPageLayout>
);

export default ApproachPage;
