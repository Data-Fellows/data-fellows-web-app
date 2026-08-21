import LandingPageLayout from "@/layouts/landing-page";
import Link from "next/link";
import { FiArrowUpRight, FiGlobe, FiHeart, FiLayers } from "react-icons/fi";
import { PartnerLogoCarousel } from "../shared/partner-logo-carousel";

const partnerCategories = [
  {
    title: "Training Partners",
    description: "Curriculum and mentorship programs we run together.",
    icon: FiLayers,
    partners: ["DataCamp Classroom", "Zummit Africa", "Vatebra Academy"],
  },
  {
    title: "Ecosystem Partners",
    description: "Start-up communities who help us scale globally.",
    icon: FiGlobe,
    partners: [
      "AWS Startups",
      "Microsoft for Startups",
      "Communitech",
      "Accelerator Centre",
      "TBDC",
      "Bhive",
      "Innovation Factory",
      "League of Innovators",
      "Vector Institute AI (Fastlane)",
      "LVLUP Ventures",
    ],
  },
  {
    title: "Community Partners",
    description: "Allies amplifying our stories, sessions, and talent.",
    icon: FiHeart,
    partners: ["Everything Analytics", "Propel", "DaElites", "Data Rango"],
  },
];

const PartnersPage = () => {
  return (
    <LandingPageLayout>
      <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
        <section className="px-4" aria-labelledby="partners-hero-heading">
          <div className="mx-auto max-w-6xl rounded-3xl border border-primary/10 bg-primary/10 px-6 py-12 lg:px-12">
            <div className="flex flex-col gap-6 text-center">
              <h1
                id="partners-hero-heading"
                className="text-3xl font-semibold text-foreground sm:text-4xl"
              >
                The strength of Data Fellows is the strength of our partners.
              </h1>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground">
                We partner with organisations who believe data can unlock
                opportunity for everyone -- from classrooms to boardrooms.
              </p>
              <Link
                href="mailto:partners@datafellowsai.com"
                className="mx-auto inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
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
              title="Partners across ecosystems"
              description="From training labs to global accelerators, these logos represent the organisations co-building Data Fellows."
              className="bg-background"
            />
          </div>
        </section>

        <section className="px-4" aria-labelledby="partner-categories-heading">
          <div className="mx-auto max-w-6xl space-y-10">
            <h2
              id="partner-categories-heading"
              className="text-3xl font-semibold text-foreground sm:text-4xl"
            >
              Partner network at a glance
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {partnerCategories.map(
                ({ title, description, partners, icon: Icon }) => (
                  <div
                    key={title}
                    className="flex h-full flex-col gap-5 rounded-3xl border border-primary/10 bg-background px-6 py-6"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-lg font-semibold text-foreground">
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
                          className="rounded-xl border border-primary/10 bg-secondary/10 px-4 py-2 text-sm font-medium text-muted-foreground"
                        >
                          {partner}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        <section className="px-4" aria-labelledby="partner-benefits-heading">
          <div className="mx-auto max-w-6xl rounded-3xl border border-primary/10 bg-background px-6 py-10">
            <h2
              id="partner-benefits-heading"
              className="text-2xl font-semibold text-foreground sm:text-3xl"
            >
              What partners experience
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                "Access to talent that has shipped real products and pilots.",
                "Rapid experimentation loops with Fellows and SMEs in-market.",
                "A warm community channel to share opportunities and insights.",
              ].map((benefit) => (
                <div
                  key={benefit}
                  className="rounded-2xl border border-primary/10 bg-secondary/10 px-4 py-4 text-sm text-muted-foreground"
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
