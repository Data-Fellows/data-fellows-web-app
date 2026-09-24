import { site } from "@/constants/site";
import PageSeo from "@/components/seo/page-seo";
import LandingPageLayout from "@/layouts/landing-page";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowUpRight,
  FiBarChart2,
  FiLayers,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

const productHighlights = [
  {
    title: "Inscend Action Board",
    description:
      "Every morning, a short list of prioritized actions -- each with its potential revenue impact -- built from your data and your operating reality.",
    icon: FiTrendingUp,
  },
  {
    title: "Impact Dashboard",
    description:
      "Track the outcome of every action, from restocks to campaigns, so you see what is actually moving revenue.",
    icon: FiBarChart2,
  },
  {
    title: "Insights Library",
    description:
      "Templates, playbooks, and community-shared learnings that get smarter with every pilot.",
    icon: FiLayers,
  },
];

const ProductsPage = () => {
  return (
    <LandingPageLayout>
      <PageSeo
        title="Products -- Data Fellows"
        description="Inscend and our other tools turn everyday business data into prioritized, revenue-impact actions -- built by Data Fellows."
        path="/products"
      />
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
                  Inscend is our flagship product: a decision layer for
                  founder-led commerce brands. It combines platform data --
                  from Shopify, SHOPLINE, and more -- with the operating
                  context only a founder knows, then turns both into a short
                  list of prioritized, ready-to-complete actions. It was
                  designed with Fellows, iterated with partners, and launched
                  with real pilots.
                </p>
                <Link
                  href={site.inscendUrl}
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
                    Built and tested through pilot projects across three
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
                Why founders love Inscend.
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

        <section className="px-4" aria-labelledby="products-cta-heading">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-3xl bg-navy-deep px-6 py-10 text-navy-deep-foreground sm:flex-row sm:items-center sm:justify-between lg:px-12">
            <div className="max-w-xl space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                Built from the community
              </p>
              <h2 id="products-cta-heading" className="text-2xl font-semibold sm:text-3xl">
                See what Fellows are building next.
              </h2>
              <p className="text-sm text-navy-deep-foreground/70">
                Join the community to follow Inscend&apos;s progress and the next
                wave of tools coming out of the ecosystem.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={site.communityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-foreground transition hover:bg-gold/90"
              >
                <FiUsers className="h-4 w-4" />
                Join the community
              </Link>
            </div>
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
};

export default ProductsPage;
