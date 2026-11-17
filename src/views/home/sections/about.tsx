import Highlight from "@/components/custom/highlight";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiLinkedin } from "react-icons/fi";

const PersonCard = ({
  name,
  role,
  tagline,
  image,
  linkedin,
}: {
  name: string;
  role: string;
  tagline: string;
  image: string;
  linkedin?: string;
}) => (
  <div className="overflow-hidden border border-border bg-background">
    <div className="relative h-64">
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width: 768px) 100vw, 280px"
        className="object-cover object-top grayscale"
      />
    </div>
    <div className="space-y-2 px-5 py-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-base font-semibold text-foreground">
            {name}
          </p>
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {role}
          </p>
        </div>
        {linkedin ? (
          <Link
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center border border-border text-foreground transition hover:bg-foreground hover:text-background"
            aria-label={`LinkedIn profile of ${name}`}
          >
            <FiLinkedin className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
      <p className="text-sm text-muted-foreground">{tagline}</p>
    </div>
  </div>
);

const About = () => {
  return (
    <section
      id="about"
      className="px-4 sm:px-6"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="grid gap-8 border border-border bg-muted/40 px-6 py-10 lg:grid-cols-12 lg:gap-12 lg:px-10">
          <div className="space-y-6 lg:col-span-7">
            <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
              01 &mdash; 2022&ndash;Now
            </span>
            <h2
              id="about-heading"
              className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Our story and <Highlight>the people</Highlight> behind it.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Data Fellows started in 2022 as a small group of people learning
              data together. That community is still here &mdash; training
              partners, mentors, and thousands of members across dozens of
              countries &mdash; and it is still how most people meet us.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              Along the way, some of those relationships turned into product
              experiments and a technical team. In 2026 we started taking on
              harder, operational problems for organizations &mdash; building
              software and AI systems and supporting what we build, while the
              community that started it all keeps growing alongside that work.
            </p>
            <div className="border border-border bg-background px-5 py-4 text-sm text-muted-foreground">
              <strong className="block font-display text-foreground">
                A community of learners and builders, now also building
                technology for problems worth solving.
              </strong>
            </div>
          </div>
          <div className="space-y-4 border border-border bg-background px-6 py-5 lg:col-span-5">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Why we exist
            </h3>
            <p className="text-sm text-muted-foreground">
              We connect curious people with mentors, collaborative projects,
              and a technical team that ships real pilots. Fellows learn,
              gather feedback from partners, and build what works &mdash; and
              where that work points to a harder problem worth solving, we
              take it on directly.
            </p>
            <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
              <FiArrowRight className="h-4 w-4" />
              <span>Join a community that builds for real-world impact.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
