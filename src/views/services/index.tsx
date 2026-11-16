import Reveal from "@/components/custom/reveal";
import PageSeo from "@/components/seo/page-seo";
import { services, servicesFaq } from "@/constants/services";
import LandingPageLayout from "@/layouts/landing-page";
import Link from "next/link";
import { FiArrowRight, FiArrowUpRight, FiCheck, FiMinus } from "react-icons/fi";

const procurementSteps = [
  {
    title: "Discovery call",
    description:
      "You describe the problem. We ask questions and tell you honestly whether it's something we're set up to help with.",
  },
  {
    title: "Technical review",
    description:
      "We look at your existing systems, data and constraints closely enough to scope real work, not a guess.",
  },
  {
    title: "Delivery plan",
    description:
      "A scoped proposal: what we'll build, what it depends on, a timeline, and what it costs.",
  },
  {
    title: "Contracting & support",
    description:
      "Terms, IP and support arrangements set out plainly before work starts -- including what's outside what we can currently support.",
  },
];

const ServicesPage = () => {
  return (
    <LandingPageLayout>
      <PageSeo
        title="What We Do -- Data Fellows"
        description="Data Fellows investigates, builds and supports software, data and AI systems for organizations with real operational problems."
        path="/services"
      />
      <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
        <section className="px-4 sm:px-6" aria-labelledby="services-hero-heading">
          <div className="mx-auto max-w-6xl border border-border bg-muted/40 px-6 py-12 text-center lg:px-12">
            <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
              What We Do
            </span>
            <h1
              id="services-hero-heading"
              className="mx-auto mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              We investigate, build and support software for complex work.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              We take responsibility for the parts of the work we agree to --
              scoped honestly, with clear boundaries on what's included,
              what isn't, and what we'd need to bring in help for.
            </p>
            <Link
              href="/contact"
              className="mx-auto mt-6 inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              Discuss a Project
              <FiArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="services-list-heading">
          <div className="mx-auto max-w-6xl space-y-10">
            <h2 id="services-list-heading" className="sr-only">
              Service families
            </h2>

            {/* Lead service: the one most buyers start a conversation about,
                given a full dark feature treatment instead of blending into
                the same box as the other three. */}
            {services[0] ? (
              <Reveal className="border border-brand-blue bg-navy-deep p-6 text-navy-deep-foreground lg:p-12">
                <span className="font-mono text-xs uppercase tracking-wide text-brand-blue">
                  Where most conversations start
                </span>
                <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  {services[0].name}
                </h3>
                <p className="mt-4 max-w-2xl border-l-2 border-brand-blue pl-4 text-lg leading-relaxed text-navy-deep-foreground/80">
                  {services[0].buyerProblem}
                </p>

                <div className="mt-10 grid gap-8 lg:grid-cols-3">
                  <div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-wide text-brand-blue">
                      Included
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-navy-deep-foreground/80">
                      {services[0].included.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-wide text-brand-blue">
                      Not included
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-navy-deep-foreground/80">
                      {services[0].excluded.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-wide text-brand-blue">
                      Deliverables
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-navy-deep-foreground/80">
                      {services[0].deliverables.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-navy-deep-foreground/15 pt-6">
                  <span className="font-mono text-xs uppercase tracking-wide text-navy-deep-foreground/60">
                    {services[0].deliveryMode}
                  </span>
                  {services[0].relatedWork?.map((work) => (
                    <Link
                      key={work.name}
                      href={work.href}
                      className="font-mono text-xs uppercase tracking-wide text-brand-blue underline underline-offset-4 hover:text-brand-blue/70"
                    >
                      Related: {work.name} (Status: {work.stage})
                    </Link>
                  ))}
                  <Link
                    href="/contact"
                    className="ml-auto inline-flex items-center gap-2 border border-brand-blue bg-brand-blue px-5 py-2.5 text-sm font-semibold text-brand-blue-foreground transition hover:bg-brand-blue/90"
                  >
                    Discuss a Project
                    <FiArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            ) : null}

            {/* The remaining services as a single unified spec sheet instead
                of three more near-identical boxes -- same information, a
                deliberately different, more compact rhythm. */}
            <div className="border border-border bg-background">
              {services.slice(1).map((service, index) => (
                <Reveal
                  key={service.key}
                  className={`grid gap-6 p-6 lg:grid-cols-12 lg:gap-10 lg:p-10 ${
                    index > 0 ? "border-t border-border" : ""
                  }`}
                >
                  <div className="lg:col-span-4">
                    <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                      {service.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {service.buyerProblem}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">
                      <span>{service.deliveryMode}</span>
                      {service.relatedWork?.map((work) => (
                        <Link
                          key={work.name}
                          href={work.href}
                          className="text-foreground underline underline-offset-4 hover:text-foreground/70"
                        >
                          {work.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {service.included.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <FiCheck className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-foreground" />
                          {item}
                        </li>
                      ))}
                      {service.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <FiArrowRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-foreground" />
                          {item}
                        </li>
                      ))}
                      {service.excluded.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-muted-foreground/70">
                          <FiMinus className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="lg:col-span-2 lg:text-right">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 border border-foreground px-4 py-2 text-xs font-semibold uppercase tracking-wide text-foreground transition hover:bg-foreground hover:text-background"
                    >
                      Discuss
                      <FiArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="procurement-heading">
          <div className="mx-auto max-w-6xl border border-brand-blue bg-navy-deep px-6 py-12 text-navy-deep-foreground lg:px-12">
            <span className="font-mono text-xs font-medium uppercase tracking-wide text-brand-blue">
              Getting Started
            </span>
            <h2
              id="procurement-heading"
              className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              What a first engagement actually looks like.
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {procurementSteps.map((step, index) => (
                <div key={step.title} className="border border-navy-deep-foreground/15 p-5">
                  <div className="font-mono text-xs uppercase tracking-wide text-brand-blue">
                    0{index + 1}
                  </div>
                  <p className="mt-2 font-display text-base font-semibold">
                    {step.title}
                  </p>
                  <p className="mt-2 text-sm text-navy-deep-foreground/70">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="services-faq-heading">
          <div className="mx-auto max-w-4xl space-y-8">
            <h2
              id="services-faq-heading"
              className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              Questions buyers ask first
            </h2>
            <div className="space-y-4">
              {servicesFaq.map((item) => (
                <div key={item.question} className="border border-border bg-background p-5">
                  <p className="font-display text-base font-semibold text-foreground">
                    {item.question}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="services-cta-heading">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 border border-foreground bg-background px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-12">
            <div className="max-w-xl space-y-2">
              <h2
                id="services-cta-heading"
                className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                Have a problem that keeps coming back?
              </h2>
              <p className="text-sm text-muted-foreground">
                Tell us what&apos;s happening, what&apos;s been tried, and
                what a better outcome would look like.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
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

export default ServicesPage;
