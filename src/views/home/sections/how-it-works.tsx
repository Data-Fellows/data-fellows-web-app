import { clientJourney } from "@/constants/approach";

// Compact version of the same client journey shown in full on /approach
// and /services -- kept to one short chip row here rather than a second
// full card grid, since the homepage already runs long. Sharing
// clientJourney (not a separate homepage-only list) is the point: this
// used to be three different, differently-counted step lists across two
// pages, which made "how working with us goes" look different depending
// on where you landed.
const HowItWorks = () => {
  return (
    <section className="px-4 sm:px-6" aria-labelledby="how-it-works-heading">
      <div className="mx-auto max-w-6xl space-y-6 border border-border bg-muted/40 px-6 py-10 lg:px-12">
        <div className="max-w-2xl space-y-2">
          <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
            How It Works
          </span>
          <h2
            id="how-it-works-heading"
            className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            From first conversation to ongoing support.
          </h2>
        </div>
        <ol className="flex flex-wrap gap-3">
          {clientJourney.map((item) => (
            <li
              key={item.step}
              className="flex items-center gap-2 border border-border bg-background px-4 py-2 font-mono text-xs uppercase tracking-wide text-muted-foreground"
            >
              <span className="text-foreground">{item.step}</span>
              {item.title}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
