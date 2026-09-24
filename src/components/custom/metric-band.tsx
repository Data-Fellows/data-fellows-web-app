import AnimatedCounter from "@/components/custom/animated-counter";
import Reveal from "@/components/custom/reveal";

type Metric = {
  value: number;
  suffix: string;
  label: string;
};

type MetricBandProps = {
  metrics: readonly Metric[];
  className?: string;
};

// The primary proof-point row -- large animated numbers on a dark card,
// reused on the homepage impact section and the dedicated /impact page so
// the same four headline stats never have to be retyped or restyled twice.
const MetricBand = ({ metrics, className = "" }: MetricBandProps) => (
  <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
    {metrics.map((metric, index) => (
      <Reveal key={metric.label} delay={index * 0.05}>
        <div className="h-full rounded-3xl bg-navy-deep px-6 py-7 text-navy-deep-foreground">
          <div className="text-4xl font-semibold tracking-tight text-gold">
            <AnimatedCounter value={metric.value} suffix={metric.suffix} />
          </div>
          <p className="mt-3 text-sm leading-6 text-navy-deep-foreground/70">
            {metric.label}
          </p>
        </div>
      </Reveal>
    ))}
  </div>
);

export default MetricBand;
