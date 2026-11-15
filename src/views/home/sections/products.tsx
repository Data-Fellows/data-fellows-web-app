import ProductSlideshow from "@/components/custom/product-slideshow";
import { products } from "@/constants/products";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

// Concise homepage previews -- the fuller feature breakdown per product
// lives on /products so this section stays a quick overview, not a second
// products page.
const Products = () => {
  return (
    <section
      id="products"
      className="px-4 sm:px-6"
      aria-labelledby="products-heading"
    >
      <div className="mx-auto max-w-6xl space-y-10 rounded-3xl bg-navy-deep px-6 py-12 text-navy-deep-foreground lg:px-10 lg:py-16">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
            Built by Data Fellows
          </span>
          <h2
            id="products-heading"
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            From learning data to shipping it.
          </h2>
          <p className="text-base leading-relaxed text-navy-deep-foreground/70">
            From helping people develop practical data skills to building
            software that solves business problems, Data Fellows has always
            been about putting knowledge to work. Here are some of the
            products we&apos;ve developed along the way.
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
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
                  {product.name}
                </span>
                <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                  {product.title}
                </h3>
                <p className="text-base leading-relaxed text-navy-deep-foreground/70">
                  {product.description}
                </p>
                <Link
                  href={product.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-foreground transition hover:bg-gold/90"
                >
                  {product.ctaLabel}
                  <FiArrowUpRight className="h-4 w-4" />
                </Link>
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
