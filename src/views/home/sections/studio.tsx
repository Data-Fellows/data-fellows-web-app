import { site } from "@/constants/site";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

const StudioSection = () => (
  <section className="px-4 sm:px-6" aria-labelledby="home-studio-heading">
    <div className="mx-auto grid max-w-6xl gap-8 border border-border bg-muted/40 px-6 py-8 md:grid-cols-12 md:items-center lg:px-10">
      <div className="space-y-3 md:col-span-8">
        <p className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Data Fellows Studio
        </p>
        <h2 id="home-studio-heading" className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Have a technology project in mind?
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Data Fellows Studio works with organizations on software, data and AI projects. We also build automation and integrations when they solve a clear operational problem.
        </p>
      </div>
      <div className="flex flex-col gap-3 md:col-span-4">
        <Link
          href="/studio"
          className="inline-flex items-center justify-center gap-2 border border-foreground px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-foreground hover:text-background"
        >
          Learn about the Studio
          <FiArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </Link>
        <Link
          href={site.studioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 border border-brand-blue-fill bg-brand-blue-fill px-5 py-3 text-sm font-semibold text-brand-blue-foreground transition hover:bg-brand-blue-fill/90"
        >
          Visit the Studio
          <FiArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);

export default StudioSection;
