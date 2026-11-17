import { FiGlobe, FiGrid, FiHeart } from "react-icons/fi";
import { PartnerLogoCarousel } from "../../shared/partner-logo-carousel";

const partnerCategories = [
  {
    title: "Training Partners",
    description: "Programs that power our learning journey.",
    icon: FiGrid,
    partners: [
      "DataCamp Classroom",
      "Zummit Africa",
      "Vatebra Academy",
      "Cisco Networking Academy",
      "Data Rango",
      "Utiva",
    ],
  },
  {
    title: "Ecosystem Partners",
    description: "Global communities that accelerate our reach.",
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
    description: "Allies who amplify stories and opportunities.",
    icon: FiHeart,
    partners: ["Everything Analytics", "Propel", "DaElites"],
  },
];

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
            We build with strong partners.
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            Our partners help us train people, connect communities, and build
            products faster. Their trust keeps Data Fellows grounded in real
            impact.
          </p>
        </div>

        <PartnerLogoCarousel />

        <div className="grid gap-8 lg:grid-cols-3">
          {partnerCategories.map(
            ({ title, description, partners, icon: Icon }) => (
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
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Partners;
