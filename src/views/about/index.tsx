import PageSeo from "@/components/seo/page-seo";
import LandingPageLayout from "@/layouts/landing-page";
import About from "../home/sections/about";
import TeamSection from "./sections/team";

const values = [
  {
    title: "Community",
    description:
      "People with different skills meet, share what they know and support one another.",
  },
  {
    title: "Learning",
    description:
      "Scholarships, mentorship, workshops and peer support help members keep learning.",
  },
  {
    title: "Building",
    description:
      "Members and contributors work on software, data systems, AI applications, research and products.",
  },
  {
    title: "Collaboration",
    description:
      "We connect people and organizations around shared interests, projects and research.",
  },
  {
    title: "Impact",
    description:
      "We help more people learn technology, grow their careers and contribute to the field.",
  },
];

const AboutUs = () => {
  return (
    <LandingPageLayout>
      <PageSeo
        title="About | Data Fellows"
        description="Learn how Data Fellows grew from a data learning community into a global community building across data, AI and software."
        path="/about"
      />
      <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
        <About />

        <section className="px-4" aria-labelledby="values-heading">
          <div className="mx-auto max-w-6xl border border-border bg-background px-6 py-10">
            <div className="space-y-6">
              <h2
                id="values-heading"
                className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                How we work together
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {values.map(({ title, description }) => (
                  <div
                    key={title}
                    className="border border-border bg-muted/40 px-5 py-5 text-sm text-muted-foreground"
                  >
                    <p className="font-display text-base font-semibold text-foreground">
                      {title}
                    </p>
                    <p className="mt-2">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <TeamSection />
      </div>
    </LandingPageLayout>
  );
};

export default AboutUs;
