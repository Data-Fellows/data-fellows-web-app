import PageSeo from "@/components/seo/page-seo";
import { partnerCategories } from "@/constants/partners";
import LandingPageLayout from "@/layouts/landing-page";
import Link from "next/link";
import { FiArrowUpRight, FiGlobe, FiHeart, FiLayers } from "react-icons/fi";
import { PartnerLogoCarousel } from "../shared/partner-logo-carousel";

// Matches partnerCategories' order in src/constants/partners.ts
// (Training & Education, Accelerator & Startup, Community Allies).
const categoryIcons = [FiLayers, FiGlobe, FiHeart];

const PartnersPage = () => {
  return (
    <LandingPageLayout>
      <PageSeo
        title="Partners | Data Fellows"
        description="Training academies, startup programs, and community allies that make up the wider network Data Fellows has been part of."
        path="/partners"
      />
      <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
        <section className="px-4" aria-labelledby="partners-hero-heading">
          <div className="mx-auto max-w-6xl border border-border bg-muted/40 px-6 py-12 lg:px-12">
            <div className="flex flex-col gap-6 text-center">
              <h1
                id="partners-hero-heading"
                className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              >
                A network that's helped Data Fellows learn, build, and grow.
              </h1>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground">
                From training academies to startup programs and community
                allies, here's the wider network Data Fellows has been part
                of, not every relationship below is the same, and we've
                tried to be clear about which is which.
              </p>
              <Link
                href="mailto:partners@datafellowsai.com"
                className="mx-auto inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
              >
                Start a partnership conversation
                <FiArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4" aria-labelledby="partner-logos-heading">
          <div className="mx-auto max-w-6xl">
            <PartnerLogoCarousel
              title="Our wider network"
              description="Training academies, startup programs and community allies Data Fellows has been part of -- see the breakdown below for what kind of relationship each represents."
              className="bg-background"
            />
          </div>
        </section>

        <section className="px-4" aria-labelledby="partner-categories-heading">
          <div className="mx-auto max-w-6xl space-y-10">
            <h2
              id="partner-categories-heading"
              className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Partner network at a glance
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {partnerCategories.map(({ title, description, partners }, index) => {
                const Icon = categoryIcons[index] ?? FiLayers;
                return (
                  <div
                    key={title}
                    className="flex h-full flex-col gap-5 border border-border bg-background px-6 py-6"
                  >
                    <span className="flex h-12 w-12 items-center justify-center border border-foreground/20 text-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-display text-lg font-semibold text-foreground">
                        {title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {description}
                      </p>
                    </div>
                    <div className="grid gap-3">
                      {partners.map((partner) => (
                        <span
                          key={partner}
                          className="border border-border bg-muted/40 px-4 py-2 text-sm font-medium text-muted-foreground"
                        >
                          {partner}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4" aria-labelledby="partner-benefits-heading">
          <div className="mx-auto max-w-6xl border border-border bg-background px-6 py-10">
            <h2
              id="partner-benefits-heading"
              className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              What a new partnership can look like
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                "Access to talent that has shipped real products and pilots.",
                "Rapid experimentation loops with Fellows and SMEs in-market.",
                "A warm community channel to share opportunities and insights.",
              ].map((benefit) => (
                <div
                  key={benefit}
                  className="border border-border bg-muted/40 px-4 py-4 text-sm text-muted-foreground"
                >
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
};

export default PartnersPage;
