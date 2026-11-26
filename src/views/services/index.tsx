import PageSeo from "@/components/seo/page-seo";
import LandingPageLayout from "@/layouts/landing-page";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

const areas = [
  {
    title: "Software and product development",
    description:
      "Explore practical software, integrations and product experiments shaped by real workflows and user needs.",
    examples: [
      { name: "HR Platform", href: "/work/hr-platform" },
      { name: "BizPilot AI", href: "/work/bizpilot" },
    ],
  },
  {
    title: "Automation and systems integration",
    description:
      "Workflow automation and integrations appear within specific documented projects. Each project page explains its origin, technical scope and current status.",
    examples: [
      { name: "HR Platform", href: "/work/hr-platform" },
      { name: "Pi Ampersand", href: "/work/pi-ampersand" },
    ],
  },
  {
    title: "Data engineering and analytics",
    description:
      "Turn public and operational data into structured, documented systems that people can examine and use.",
    examples: [
      { name: "Ontario Infrastructure project", href: "/work/ont-communities" },
      { name: "Xetra ETL Pipeline", href: "/work/xetra-etl-pipeline" },
    ],
  },
  {
    title: "Artificial intelligence and research",
    description:
      "Study where AI can support existing work, test ideas and document what a prototype does and does not show.",
    examples: [
      { name: "Pi Ampersand", href: "/work/pi-ampersand" },
      { name: "PidginNuance", href: "/work/pidginnuance" },
    ],
  },
];

const TechnologyPage = () => (
  <LandingPageLayout>
    <PageSeo
      title="Technology Development | Data Fellows"
      description="Explore the software, data engineering, AI and research work documented by Data Fellows and its community."
      path="/services"
    />
    <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
      <section className="px-4 sm:px-6" aria-labelledby="technology-heading">
        <div className="mx-auto max-w-6xl border border-border bg-muted/40 px-6 py-12 lg:px-12 lg:py-16">
          <p className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Technology development
          </p>
          <h1
            id="technology-heading"
            className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-5xl"
          >
            People learning, exploring and building with technology.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Software development remains part of Data Fellows&apos; identity. Our archive shows the products, research and independent technical projects people have explored across data, AI and software.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6" aria-labelledby="technology-areas-heading">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="max-w-2xl space-y-3">
            <h2
              id="technology-areas-heading"
              className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              Areas represented in the work
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The examples below include different origins and stages. Their presence does not imply an active product, client engagement or guaranteed participation opportunity.
            </p>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {areas.map((area) => (
              <article
                key={area.title}
                className="grid gap-5 py-7 sm:grid-cols-[minmax(0,1fr)_minmax(14rem,0.65fr)] sm:gap-10"
              >
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {area.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    {area.description}
                  </p>
                </div>
                <ul className="space-y-2">
                  {area.examples.map((example) => (
                    <li key={example.href}>
                      <Link
                        href={example.href}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                      >
                        {example.name}
                        <FiArrowUpRight aria-hidden="true" className="h-4 w-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6" aria-labelledby="technology-context-heading">
        <div className="mx-auto grid max-w-6xl gap-8 border border-border bg-background px-6 py-8 md:grid-cols-2 lg:px-10">
          <div className="space-y-3">
            <h2 id="technology-context-heading" className="font-display text-xl font-semibold text-foreground">
              Clear project context
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Project pages identify whether work came from Data Fellows, a collaboration, an independent contributor or research. Historical products such as Inscend and BizPilot AI are documented as concluded explorations.
            </p>
            <Link href="/work" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Browse all projects
              <FiArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3 border-t border-border pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Build with the community
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Members are not treated as an on-demand workforce. Any future project participation is discussed, agreed and compensated where appropriate.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/community" className="inline-flex items-center gap-2 border border-foreground px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-foreground hover:text-background">
                Explore the community
              </Link>
              <Link href="/partners" className="inline-flex items-center gap-2 border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-foreground">
                Collaboration opportunities
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  </LandingPageLayout>
);

export default TechnologyPage;
