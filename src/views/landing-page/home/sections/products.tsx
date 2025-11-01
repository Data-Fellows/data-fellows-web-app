import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight, FiStar } from "react-icons/fi";

const features = [
  {
    title: "Action Board",
    description:
      "Guided workflows for shop owners to analyse sales, expenses, and inventory without needing an analyst.",
  },
  {
    title: "Impact Dashboard",
    description:
      "Visualise growth, spot opportunities, and measure the results of every experiment in real time.",
  },
  {
    title: "Built with Fellows",
    description:
      "Inscend was prototyped and stress-tested with the businesses in our ecosystem, ensuring it solves practical challenges.",
  },
];

const Products = () => {
  return (
    <section
      id="products"
      className="px-4"
      aria-labelledby="products-heading"
    >
      <div className="mx-auto max-w-6xl rounded-3xl border border-primary/10 bg-background px-6 py-12 shadow-lg lg:px-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="space-y-6 lg:col-span-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Products
            </span>
            <h2
              id="products-heading"
              className="text-3xl font-semibold text-foreground sm:text-4xl"
            >
              Tools born from real problems.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              We do not just learn -- we build. Inscend helps small shop owners
              understand their business and act on it without needing an
              analyst. Every feature is inspired by questions that surfaced
              inside the community.
            </p>
            <div className="space-y-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-secondary/50 px-4 py-4 shadow-sm"
                >
                  <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <FiStar className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="https://inscend.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              Explore Inscend.io
              <FiArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-secondary/30 shadow-lg">
              <Image
                src="/images/company-dash.png"
                alt="Inscend dashboards"
                width={920}
                height={600}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-4 left-4 rounded-2xl bg-background/90 px-4 py-3 text-xs text-muted-foreground shadow-sm backdrop-blur">
                Built with real Data Fellows businesses in Lagos, Nairobi, and
                Toronto.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;


