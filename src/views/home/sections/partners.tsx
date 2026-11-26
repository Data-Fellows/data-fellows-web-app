import { partnerCategories } from "@/constants/partners";
import Link from "next/link";
import { FiGlobe, FiGrid, FiHeart } from "react-icons/fi";
import { PartnerLogoCarousel } from "../../shared/partner-logo-carousel";

// Matches partnerCategories' order in src/constants/partners.ts
// (Training & Education, Accelerator & Startup, Community Allies).
const categoryIcons = [FiGrid, FiGlobe, FiHeart];

const Partners = () => {
  return (
    <section
      id="partners"
      className="px-4 sm:px-6"
      aria-labelledby="partners-heading"
    >
      <div className="mx-auto max-w-6xl space-y-8 border border-border bg-background px-6 py-12 lg:px-10 lg:py-16">
        <div className="space-y-4 text-center">
          <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
Partners
          </span>
          <h2
            id="partners-heading"
            className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            A network that's helped us learn, build, and grow.
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            Training academies, startup programs, and community allies
            Data Fellows has been part of, not every relationship is the
            same kind.
          </p>
        </div>

        <PartnerLogoCarousel />

        <div className="grid gap-8 lg:grid-cols-3">
          {partnerCategories.map(
            ({ title, description, partners }, index) => {
              const Icon = categoryIcons[index] ?? FiGrid;
              return (
                <div
                  key={title}
                  className="flex flex-col gap-5 border border-border bg-muted/40 p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center border border-foreground/20 text-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{description}</p>
                  <div className="grid gap-3">
                    {partners.map((partner) => (
                      <span
                        key={partner}
                        className="border border-border bg-background px-4 py-3 text-sm font-medium text-muted-foreground"
                      >
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }
          )}
        </div>
        <div className="text-center">
          <Link
            href="/partners"
            className="inline-flex items-center justify-center border border-foreground px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-foreground hover:text-background"
          >
            Explore collaboration opportunities
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Partners;
