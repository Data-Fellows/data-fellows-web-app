import AffiliationMarks from "@/components/custom/affiliation-marks";
import AvatarStack from "@/components/custom/avatar-stack";
import Highlight from "@/components/custom/highlight";
import { affiliationOrder } from "@/constants/affiliations";
import { foundingTeam } from "@/views/shared/team";
import Link from "next/link";

const StudioCredibility = () => {
  return (
    <section
      id="studio-credibility"
      className="px-4 sm:px-6"
      aria-labelledby="studio-credibility-heading"
    >
      <div className="mx-auto max-w-6xl space-y-6 border border-border bg-background px-6 py-10 text-center lg:px-12">
        <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Experience across our team
        </span>
        <h2
          id="studio-credibility-heading"
          className="mx-auto max-w-2xl font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Our team brings experience from{" "}
          <Highlight>PwC, Cohere and Andela</Highlight>, spanning enterprise
          consulting, software engineering, data infrastructure and
          artificial intelligence.
        </h2>
        <div className="flex justify-center">
          <AffiliationMarks keys={affiliationOrder} size="md" />
        </div>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <AvatarStack people={foundingTeam} />
          <p className="max-w-xl text-xs text-muted-foreground">
            These are professional backgrounds, not client or sponsor logos.{" "}
            <Link href="/people" className="underline hover:text-foreground">
              Meet the people behind Data Fellows
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default StudioCredibility;
