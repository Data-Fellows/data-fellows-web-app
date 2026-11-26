import { products } from "@/constants/products";
import { portfolioProjects } from "@/constants/portfolio";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

// Feature active technical and research projects on the homepage. Historical
// product experiments remain available in the full /work archive.
const flagshipSlugs = ["ont-communities", "hr-platform", "pi-ampersand", "pidginnuance"];

const flagships = flagshipSlugs
  .map((slug) => {
    const product = products.find((item) => item.key === slug);
    if (product) {
      return {
        slug: product.key,
        name: product.name,
        headline: product.goal,
        origin: "Data Fellows product",
        status: product.stage,
      };
    }
    const project = portfolioProjects.find((item) => item.slug === slug);
    if (project) {
      return {
        slug: project.slug,
        name: project.name,
        headline: project.headline,
        origin: project.projectOrigin,
        status: project.projectStatus,
      };
    }
    return null;
  })
  .filter((item): item is NonNullable<typeof item> => Boolean(item));

const SelectedWork = () => {
  return (
    <section
      id="selected-work"
      className="px-4 sm:px-6"
      aria-labelledby="selected-work-heading"
    >
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="max-w-2xl space-y-4">
          <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Selected Work
          </span>
          <h2
            id="selected-work-heading"
            className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Software, data and AI in practice.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Explore technical projects and experiments. Each entry shows whether it is a community initiative, an individual project, research or an open-source contribution.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {flagships.map((item) => (
            <Link
              key={item.slug}
              href={`/work/${item.slug}`}
              className="group flex h-full flex-col gap-3 border border-border bg-background p-6 transition hover:border-foreground/40"
            >
              <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                {item.origin}
              </span>
              <h3 className="font-display text-xl font-semibold text-foreground">
                {item.name}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.headline}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-foreground">
                View case study
                <FiArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 border border-foreground px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-foreground hover:text-background"
          >
            Explore all work
            <FiArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SelectedWork;
