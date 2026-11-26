import PageSeo from "@/components/seo/page-seo";
import LandingPageLayout from "@/layouts/landing-page";
import About from "../home/sections/about";
import TeamSection from "./sections/team";

const values = [
  {
    title: "Community",
    description:
      "We connect people across experience levels and disciplines so they can build relationships, exchange knowledge and grow together.",
  },
  {
    title: "Learning",
    description:
      "We support practical education and professional development through learning initiatives, mentorship, workshops and peer support.",
  },
  {
    title: "Building",
    description:
      "Members and contributors explore software, data systems, AI applications, research and experimental products.",
  },
  {
    title: "Collaboration",
    description:
      "We bring people and organizations together around shared interests, technical projects and meaningful problems.",
  },
  {
    title: "Impact",
    description:
      "We work to expand access to technology learning, professional growth and innovation across the wider ecosystem.",
  },
];

const AboutUs = () => {
  return (
    <LandingPageLayout>
      <PageSeo
        title="About | Data Fellows"
        description="Learn about Data Fellows, a global community-led technology organization founded in 2022 to advance learning, collaboration and innovation across data, AI and software."
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
