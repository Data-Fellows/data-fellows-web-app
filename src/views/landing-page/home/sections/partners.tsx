import { FiGlobe, FiGrid, FiHeart } from "react-icons/fi";

const partnerCategories = [
  {
    title: "Training Partners",
    description: "Programs that power our learning journey.",
    icon: FiGrid,
    partners: ["DataCamp Classroom", "Zummit Africa", "Vatebra Academy"],
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
    ],
  },
  {
    title: "Community Partners",
    description: "Allies who amplify stories and opportunities.",
    icon: FiHeart,
    partners: ["Everything Analytics", "Propel", "DaElites", "Data Rango"],
  },
];

const Partners = () => {
  return (
    <section id="partners" className="px-4" aria-labelledby="partners-heading">
      <div className="mx-auto max-w-6xl space-y-8 rounded-3xl border border-primary/10 bg-background px-6 py-12 lg:px-10 lg:py-16">
        <div className="space-y-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Partners
          </span>
          <h2
            id="partners-heading"
            className="text-3xl font-semibold text-foreground sm:text-4xl"
          >
            We build with strong partners.
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            Our partners help us train people, connect communities, and build
            products faster. Their trust keeps Data Fellows grounded in real
            impact.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {partnerCategories.map(
            ({ title, description, partners, icon: Icon }) => (
              <div
                key={title}
                className="flex flex-col gap-5 rounded-2xl border border-primary/10 bg-secondary/10 p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">
                    {title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">{description}</p>
                <div className="grid gap-3">
                  {partners.map((partner) => (
                    <span
                      key={partner}
                      className="rounded-xl border border-primary/10 bg-background px-4 py-3 text-sm font-medium text-muted-foreground"
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
