import { site } from "@/constants/site";
import Link from "next/link";
import { FiArrowUpRight, FiUsers } from "react-icons/fi";

const Cta = () => {
  return (
    <section className="px-4 sm:px-6" aria-labelledby="cta-heading">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-3xl bg-gold px-6 py-14 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-foreground/70">
            Come build with us
          </p>
          <h2
            id="cta-heading"
            className="text-3xl font-semibold tracking-tight text-gold-foreground sm:text-4xl"
          >
            Join a community where learning leads somewhere.
          </h2>
          <p className="text-gold-foreground/80">
            Meet people, join a learning rhythm, ship projects and contribute
            to products built from real problems.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={site.communityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-navy-deep px-6 py-3 text-sm font-semibold text-navy-deep-foreground transition hover:bg-navy-deep/90"
          >
            <FiUsers className="h-4 w-4" />
            Join the ecosystem
          </Link>
          <Link
            href="/partners"
            className="inline-flex items-center gap-2 rounded-full border border-gold-foreground/20 bg-background/80 px-6 py-3 text-sm font-semibold text-gold-foreground transition hover:bg-background"
          >
            Partner with us
            <FiArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cta;
