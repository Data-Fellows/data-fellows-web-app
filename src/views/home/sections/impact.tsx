import MetricBand from "@/components/custom/metric-band";
import { impactStats } from "@/constants/site";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const Impact = () => {
  return (
    <section
      id="impact"
      className="px-4 sm:px-6"
      aria-labelledby="impact-heading"
    >
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-3">
            <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
              04 &mdash; Measured Impact
            </span>
            <h2
              id="impact-heading"
              className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              The proof is stronger than the pitch.
            </h2>
          </div>
          <Link
            href="/impact"
            className="inline-flex items-center gap-2 border border-foreground px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-foreground hover:text-background"
          >
            Open impact dashboard
            <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <MetricBand metrics={impactStats} />
      </div>
    </section>
  );
};

export default Impact;
