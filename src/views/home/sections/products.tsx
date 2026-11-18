import ProductSlideshow from "@/components/custom/product-slideshow";
import { products } from "@/constants/products";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

// Concise homepage previews -- the fuller feature breakdown per product
// lives on /work so this section stays a quick overview, not a second
// work index.
const Products = () => {
  return (
    <section
      id="products"
      className="px-4 sm:px-6"
      aria-labelledby="products-heading"
    >
      <div className="mx-auto max-w-6xl space-y-10 bg-navy-deep px-6 py-12 text-navy-deep-foreground lg:px-10 lg:py-16">
        <div className="max-w-3xl space-y-4">
          <span className="font-mono text-xs font-medium uppercase tracking-wide text-brand-blue">
Things We&apos;ve Explored and Built
          </span>
          <h2
            id="products-heading"
            className="font-display text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Built while we learned what works.
          </h2>
          <p className="text-base leading-relaxed text-navy-deep-foreground/70">
            A look at the products we&apos;ve explored along the way, each at
            its own stage.
          </p>
        </div>

        <div className="space-y-12">
          {products.map((product, index) => (
            <div
              key={product.key}
              className={`grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14 ${
                index > 0 ? "border-t border-white/10 pt-12" : ""
              }`}
            >
              <div className="space-y-5 lg:col-span-5">
                <div className="font-mono text-[11px] uppercase tracking-wide text-brand-blue">
                  Status: {product.stage}
                </div>
                <h3 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                  {product.name}
                </h3>
                <p className="text-base leading-relaxed text-navy-deep-foreground/70">
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={product.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-brand-blue bg-brand-blue-fill px-6 py-3 text-sm font-semibold text-brand-blue-foreground transition hover:bg-brand-blue-fill/90"
                  >
                    {product.ctaLabel}
                    <FiArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/work/${product.key}`}
                    className="inline-flex items-center gap-2 border border-navy-deep-foreground/20 px-6 py-3 text-sm font-semibold text-navy-deep-foreground transition hover:bg-navy-deep-foreground/10"
                  >
                    View case study
                    <FiArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7">
                <ProductSlideshow slides={product.slides} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
