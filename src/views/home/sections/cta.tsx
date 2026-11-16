import Link from "next/link";
import { useRouter } from "next/router";
import { FiArrowUpRight } from "react-icons/fi";

const Cta = () => {
  const router = useRouter();

  return (
    <section className="px-4 sm:px-6" aria-labelledby="cta-heading">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 border border-gold bg-navy-deep px-6 py-14 text-navy-deep-foreground sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14">
        <div className="max-w-2xl space-y-3">
          <p className="font-mono text-xs font-medium uppercase tracking-wide text-gold">
Work With Us
          </p>
          <h2
            id="cta-heading"
            className="font-display text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Have a problem that keeps coming back?
          </h2>
          <p className="text-navy-deep-foreground/70">
            Tell us what&apos;s happening, what&apos;s been tried, and what a
            better outcome would look like. We&apos;ll look at it and tell you
            honestly whether there&apos;s a useful way to work together.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => router.push("/contact")}
            className="inline-flex items-center gap-2 border border-gold bg-gold px-6 py-3 text-sm font-semibold text-gold-foreground transition hover:bg-gold/90"
          >
            Discuss a Problem
          </button>
          <Link
            href="/partners"
            className="inline-flex items-center gap-2 border border-navy-deep-foreground/20 px-6 py-3 text-sm font-semibold text-navy-deep-foreground transition hover:bg-navy-deep-foreground/10"
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
