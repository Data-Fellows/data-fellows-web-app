import LandingPageLayout from "@/layouts/landing-page";
import About from "../home/sections/about";
import TeamSection from "./sections/team";

const values = [
  {
    title: "Learn in public",
    description:
      "We share works in progress, reflections, and data discoveries so others can build faster.",
  },
  {
    title: "Prototype with purpose",
    description:
      "Every experiment, from mentorship to product pilots, solves a challenge real people face.",
  },
  {
    title: "Keep it human",
    description:
      "We translate technical ideas into everyday language so anyone can act on data.",
  },
];

const AboutUs = () => {
  return (
    <LandingPageLayout>
      <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
        <About />

        <section className="px-4" aria-labelledby="values-heading">
          <div className="mx-auto max-w-6xl rounded-3xl border border-primary/10 bg-background px-6 py-10">
            <div className="space-y-6">
              <h2
                id="values-heading"
                className="text-2xl font-semibold text-foreground sm:text-3xl"
              >
                How we work together
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {values.map(({ title, description }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-primary/10 bg-secondary/50 px-5 py-5 text-sm text-muted-foreground"
                  >
                    <p className="text-base font-semibold text-foreground">
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
