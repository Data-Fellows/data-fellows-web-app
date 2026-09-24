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
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Measured impact
            </span>
            <h2
              id="impact-heading"
              className="text-3xl font-semibold text-foreground sm:text-4xl"
            >
              The proof is stronger than the pitch.
            </h2>
          </div>
          <Link
            href="/impact"
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/40"
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
