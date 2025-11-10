import LandingPageLayout from "@/layouts/landing-page";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowUpRight,
  FiBarChart2,
  FiLayers,
  FiTrendingUp,
} from "react-icons/fi";

const productHighlights = [
  {
    title: "Inscend Action Board",
    description:
      "Daily prompts that help shop owners turn raw numbers into the next right move.",
    icon: FiTrendingUp,
  },
  {
    title: "Impact Dashboard",
    description:
      "Track experiments, campaigns, and growth without needing to build complex spreadsheets.",
    icon: FiBarChart2,
  },
  {
    title: "Insights Library",
    description:
      "Templates, playbooks, and community-shared learnings that get smarter with every pilot.",
    icon: FiLayers,
  },
];

const roadmap = [
  {
    quarter: "Q1 2026",
    focus: "Intake automation",
    detail:
      "Smart onboarding wizard that tailors Inscend to each small business domain.",
  },
  {
    quarter: "Q2 2026",
    focus: "Community signal hub",
    detail:
      "Surface real wins and lessons from Fellows directly inside the product.",
  },
  {
    quarter: "Q3 2026",
    focus: "Partner co-build kits",
    detail:
      "Launch packs that help partners customise Inscend for their own ecosystems.",
  },
];

const caseStudies = [
  {
    name: "Lagos neighborhood grocer",
    result: "35% lift in repeat customers after automating restock alerts.",
  },
  {
    name: "Toronto wellness studio",
    result: "Saved 12 hours weekly by streamlining bookings and payments data.",
  },
  {
    name: "Accra food collective",
    result: "Improved supplier negotiations using Inscend's margin insights.",
  },
];

const ProductsPage = () => {
  return (
    <LandingPageLayout>
      <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
        <section className="px-4" aria-labelledby="products-hero-heading">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-primary/10 bg-background">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="space-y-6 px-6 py-12 lg:col-span-6 lg:px-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  Products
                </span>
                <h1
                  id="products-hero-heading"
                  className="text-3xl font-semibold text-foreground sm:text-4xl"
                >
                  Build with tools born from the Data Fellows ecosystem.
                </h1>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Inscend is our flagship product -- a co-pilot for small
                  businesses that turns messy data into confident action. It was
                  designed with Fellows, iterated with partners, and launched
                  with real pilots.
                </p>
                <Link
                  href="https://inscend.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Explore Inscend.io
                  <FiArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="relative h-full w-full lg:col-span-6">
                <div className="relative h-full min-h-[320px]">
                  <Image
                    src="/images/actioncard.png"
                    alt="Preview of Inscend dashboards"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute bottom-4 left-4 rounded-2xl bg-background/90 px-4 py-3 text-xs text-muted-foreground backdrop-blur">
                    Built and refined with 20 pilot projects across 3
                    continents.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4" aria-labelledby="highlight-heading">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="text-center">
              <h2
                id="highlight-heading"
                className="text-3xl font-semibold text-foreground sm:text-4xl"
              >
                Why small businesses love Inscend.
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
                Every feature ties back to questions we heard from founders in
                the community -- and the mentors who support them.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {productHighlights.map(({ title, description, icon: Icon }) => (
                <div
                  key={title}
                  className="flex h-full flex-col gap-4 rounded-3xl border border-primary/10 bg-secondary/10 px-6 py-6"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* <section className="px-4" aria-labelledby="case-studies-heading">
          <div className="mx-auto max-w-6xl rounded-3xl border border-primary/10 bg-background px-6 py-10">
            <h2
              id="case-studies-heading"
              className="text-2xl font-semibold text-foreground sm:text-3xl"
            >
              Case study snapshots
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {caseStudies.map(({ name, result }) => (
                <div
                  key={name}
                  className="rounded-2xl border border-primary/10 bg-secondary/10 px-4 py-4"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {name}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{result}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4" aria-labelledby="roadmap-heading">
          <div className="mx-auto max-w-6xl space-y-6 rounded-3xl border border-primary/10 bg-secondary/10 px-6 py-10">
            <h2
              id="roadmap-heading"
              className="text-2xl font-semibold text-foreground sm:text-3xl"
            >
              Roadmap highlights
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {roadmap.map(({ quarter, focus, detail }) => (
                <div
                  key={quarter}
                  className="rounded-2xl border border-primary/10 bg-background px-5 py-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {quarter}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {focus}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section> */}
      </div>
    </LandingPageLayout>
  );
};

export default ProductsPage;
