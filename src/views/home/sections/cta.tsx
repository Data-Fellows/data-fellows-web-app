import Link from "next/link";
import { site } from "@/constants/site";
import { FiArrowUpRight } from "react-icons/fi";

const Cta = () => {
  return (
    <section className="px-4 sm:px-6" aria-labelledby="cta-heading">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 border border-brand-blue bg-navy-deep px-6 py-14 text-navy-deep-foreground sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14">
        <div className="max-w-2xl space-y-3">
          <p className="font-mono text-xs font-medium uppercase tracking-wide text-brand-blue">
              Join Data Fellows
          </p>
          <h2
            id="cta-heading"
            className="font-display text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Learn, build and grow with us.
          </h2>
          <p className="text-navy-deep-foreground/70">
            Join a global community learning and building across data, AI and software. If you have a technology project, find out how our Studio can help.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={site.communityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-brand-blue bg-brand-blue-fill px-6 py-3 text-sm font-semibold text-brand-blue-foreground transition hover:bg-brand-blue-fill/90"
          >
            Join the Community
          </Link>
          <Link
            href="/partners"
            className="inline-flex items-center gap-2 border border-navy-deep-foreground/20 px-6 py-3 text-sm font-semibold text-navy-deep-foreground transition hover:bg-navy-deep-foreground/10"
          >
            Collaborate with us
            <FiArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 border border-navy-deep-foreground/20 px-6 py-3 text-sm font-semibold text-navy-deep-foreground transition hover:bg-navy-deep-foreground/10"
          >
            Explore the Studio
            <FiArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cta;
