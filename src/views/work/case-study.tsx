import ProductSlideshow from "@/components/custom/product-slideshow";
import PageSeo from "@/components/seo/page-seo";
import type { Product } from "@/constants/products";
import LandingPageLayout from "@/layouts/landing-page";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiArrowUpRight, FiLinkedin } from "react-icons/fi";

const CaseStudyPage = ({ product }: { product: Product }) => {
  return (
    <LandingPageLayout>
      <PageSeo
        title={`${product.name} -- Data Fellows`}
        description={product.goal}
        path={`/work/${product.key}`}
      />
      <div className="space-y-16 pt-28 md:space-y-20 md:pt-32">
        <section className="px-4 sm:px-6" aria-labelledby="case-study-heading">
          <div className="mx-auto max-w-4xl space-y-6">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-muted-foreground hover:text-foreground"
            >
              <FiArrowLeft className="h-3.5 w-3.5" />
              Back to Work
            </Link>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">
              <span className="border border-border px-2 py-1">
                {product.workType}
              </span>
              <span className="border border-brand-blue-label px-2 py-1 text-brand-blue-label">
                Status: {product.stage}
              </span>
              {product.capabilities.map((capability) => (
                <span key={capability} className="border border-border px-2 py-1">
                  {capability}
                </span>
              ))}
            </div>

            {product.logo ? (
              <div className="inline-block border border-border p-2">
                <Image
                  src={product.logo.src}
                  alt={`${product.name} logo`}
                  width={product.logo.width}
                  height={product.logo.height}
                  className="h-10 w-auto"
                />
              </div>
            ) : null}
            <h1
              id="case-study-heading"
              className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-5xl"
            >
              {product.name}
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {product.title}
            </p>

            <p className="border-l-2 border-brand-blue pl-4 text-sm italic leading-relaxed text-muted-foreground">
              This is a self-initiated product exploration, not a delivered
              client engagement -- written up honestly, at the depth we can
              currently document. We'll add more as it's documented further.
            </p>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="case-study-visuals">
          <div className="mx-auto max-w-4xl">
            <h2 id="case-study-visuals" className="sr-only">
              Visual evidence
            </h2>
            <ProductSlideshow slides={product.slides} />
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="case-study-context">
          <div className="mx-auto max-w-4xl space-y-10">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Context
              </p>
              <h2 id="case-study-context" className="sr-only">
                Context
              </h2>
              <p className="mt-3 text-base leading-relaxed text-foreground">
                {product.description}
              </p>
            </div>

            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Goal
              </p>
              <p className="mt-3 text-base leading-relaxed text-foreground">
                {product.goal}
              </p>
            </div>

            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Scope
              </p>
              <div className="mt-4 grid gap-6 sm:grid-cols-3">
                {product.highlights.map((highlight) => (
                  <div key={highlight.title} className="border border-border bg-muted/40 p-5">
                    <p className="font-display text-base font-semibold text-foreground">
                      {highlight.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {highlight.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {product.advisors && product.advisors.length > 0 ? (
          <section className="px-4 sm:px-6" aria-labelledby="case-study-advisors">
            <div className="mx-auto max-w-4xl space-y-6">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Advisors
                </p>
                <h2 id="case-study-advisors" className="sr-only">
                  Advisors to {product.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Also Data Fellows advisors today -- shown here for the role
                  they played specifically on {product.name}.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {product.advisors.map((advisor) => (
                  <div
                    key={advisor.name}
                    className="flex gap-4 border border-border bg-background p-5"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden">
                      <Image
                        src={advisor.image}
                        alt={advisor.name}
                        fill
                        sizes="80px"
                        className="object-cover object-top grayscale"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-display text-base font-semibold text-foreground">
                          {advisor.name}
                        </p>
                        {advisor.linkedin ? (
                          <Link
                            href={advisor.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`LinkedIn profile of ${advisor.name}`}
                            className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center border border-border text-foreground transition hover:bg-foreground hover:text-background"
                          >
                            <FiLinkedin className="h-3.5 w-3.5" />
                          </Link>
                        ) : null}
                      </div>
                      <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                        {advisor.role}
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {advisor.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="px-4 sm:px-6" aria-labelledby="case-study-cta">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 border border-foreground bg-background px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl space-y-2">
              <h2
                id="case-study-cta"
                className="font-display text-2xl font-semibold tracking-tight text-foreground"
              >
                Have a similar problem?
              </h2>
              <p className="text-sm text-muted-foreground">
                Talk to us about something in this space, or see where{" "}
                {product.name} actually lives today.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-foreground bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-foreground/90"
              >
                Discuss a Project
                <FiArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href={product.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-foreground/40"
              >
                {product.ctaLabel}
                <FiArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
};

export default CaseStudyPage;
