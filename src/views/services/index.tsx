import PageSeo from "@/components/seo/page-seo";
import { services, servicesFaq } from "@/constants/services";
import LandingPageLayout from "@/layouts/landing-page";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

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
            <div className="space-y-10">
              {services.map((service, index) => (
                <div
                  key={service.key}
                  className="border border-border bg-background p-6 lg:p-10"
                >
                  <div className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    0{index + 1}
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {service.name}
                  </h3>
                  <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      The problem:{" "}
                    </span>
                    {service.buyerProblem}
                  </p>

                  <div className="mt-8 grid gap-8 lg:grid-cols-3">
                    <div>
                      <p className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Included
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {service.included.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Not included
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {service.excluded.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Deliverables
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {service.deliverables.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-border pt-6">
                    <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                      {service.deliveryMode}
                    </span>
                    {service.relatedWork?.map((work) => (
                      <Link
                        key={work.name}
                        href={work.href}
                        className="font-mono text-xs uppercase tracking-wide text-foreground underline underline-offset-4 hover:text-foreground/70"
                      >
                        Related: {work.name} (Status: {work.stage})
                      </Link>
                    ))}
                    <Link
                      href="/contact"
                      className="ml-auto inline-flex items-center gap-2 border border-foreground px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-foreground hover:text-background"
                    >
                      Discuss a Project
                      <FiArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="procurement-heading">
          <div className="mx-auto max-w-6xl border border-gold bg-navy-deep px-6 py-12 text-navy-deep-foreground lg:px-12">
            <span className="font-mono text-xs font-medium uppercase tracking-wide text-gold">
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
                  <div className="font-mono text-xs uppercase tracking-wide text-gold">
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
