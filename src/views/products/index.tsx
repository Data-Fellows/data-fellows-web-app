import ProductSlideshow from "@/components/custom/product-slideshow";
import { site } from "@/constants/site";
import { products } from "@/constants/products";
import PageSeo from "@/components/seo/page-seo";
import LandingPageLayout from "@/layouts/landing-page";
import Link from "next/link";
import { FiArrowUpRight, FiUsers } from "react-icons/fi";

const ProductsPage = () => {
  return (
    <LandingPageLayout>
      <PageSeo
        title="Products -- Data Fellows"
        description="BizPilot and Inscend: two products born from the Data Fellows ecosystem, built by and with Fellows."
        path="/products"
      />
      <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
        <section className="px-4" aria-labelledby="products-hero-heading">
          <div className="mx-auto max-w-6xl space-y-6 rounded-3xl border border-primary/10 bg-background px-6 py-12 text-center lg:px-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Products
            </span>
            <h1
              id="products-hero-heading"
              className="mx-auto max-w-3xl text-3xl font-semibold text-foreground sm:text-4xl"
            >
              Build with tools born from the Data Fellows ecosystem.
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
              From helping people develop practical data skills to building
              software that solves business problems, Data Fellows has always
              been about putting knowledge to work. Here&apos;s a closer look
              at the products we&apos;ve developed along the way.
            </p>
          </div>
        </section>

        {products.map((product) => (
          <section
            key={product.key}
            className="px-4"
            aria-labelledby={`${product.key}-heading`}
          >
            <div className="mx-auto max-w-6xl space-y-10">
              <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
                <div className="space-y-5 lg:col-span-5">
                  <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    {product.name}
                  </span>
                  <h2
                    id={`${product.key}-heading`}
                    className="text-3xl font-semibold text-foreground sm:text-4xl"
                  >
                    {product.title}
                  </h2>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                  <Link
                    href={product.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    {product.ctaLabel}
                    <FiArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="lg:col-span-7">
                  <ProductSlideshow slides={product.slides} />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {product.highlights.map((highlight) => (
                  <div
                    key={highlight.title}
                    className="flex h-full flex-col gap-2 rounded-3xl border border-primary/10 bg-secondary/10 px-6 py-6"
                  >
                    <h3 className="text-lg font-semibold text-foreground">
                      {highlight.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {highlight.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

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
                Join the community to follow the next wave of tools coming out
                of the ecosystem.
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
