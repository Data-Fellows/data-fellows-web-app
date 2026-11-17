import AffiliationMarks from "@/components/custom/affiliation-marks";
import { affiliationOrder } from "@/constants/affiliations";
import Link from "next/link";

// This is deliberately not headed "Trusted by" or "Our clients" -- PwC,
// Cohere and Andela are professional backgrounds individual Fellows bring to
// Data Fellows, not clients or commercial partners of the company. See each
// person's profile on /people for which company connects to whom.
const StudioCredibility = () => {
  return (
    <section
      id="studio-credibility"
      className="px-4 sm:px-6"
      aria-labelledby="studio-credibility-heading"
    >
      <div className="mx-auto max-w-6xl space-y-6 border border-border bg-background px-6 py-10 text-center lg:px-12">
        <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Independent studio. Experienced people.
        </span>
        <h2
          id="studio-credibility-heading"
          className="mx-auto max-w-2xl font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Our team brings together experience from PwC, Cohere and Andela,
          spanning enterprise consulting, software engineering, data
          infrastructure and artificial intelligence.
        </h2>
        <div className="flex justify-center">
          <AffiliationMarks keys={affiliationOrder} size="md" />
        </div>
        <p className="mx-auto max-w-xl text-xs text-muted-foreground">
          Professional backgrounds our team members bring with them, not
          client or partner relationships.{" "}
          <Link href="/people" className="underline hover:text-foreground">
            Meet the people behind Data Fellows
          </Link>
          .
        </p>
      </div>
    </section>
  );
};

export default StudioCredibility;
