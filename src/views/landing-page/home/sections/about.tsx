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
  <div className="overflow-hidden rounded-3xl border border-primary/10 bg-background">
    <div className="relative h-64">
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width: 768px) 100vw, 280px"
        className="object-cover"
      />
    </div>
    <div className="space-y-2 px-5 py-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-foreground">{name}</p>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {role}
          </p>
        </div>
        {linkedin ? (
          <Link
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 text-primary transition hover:bg-primary hover:text-primary-foreground"
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
        <div className="grid gap-8 rounded-3xl border border-primary/10 bg-secondary/10 px-6 py-10 lg:grid-cols-12 lg:gap-12 lg:px-10">
          <div className="space-y-6 lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              About
            </span>
            <h2
              id="about-heading"
              className="text-3xl font-semibold text-foreground sm:text-4xl"
            >
              Our story and the people behind it.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Data Fellows started with a simple belief - data should help
              people, not confuse them. What began as a small group of learners
              has grown into a global ecosystem that connects training,
              mentorship, and product innovation. Every Fellow contributes to a
              shared goal: helping people and businesses make smarter decisions.
            </p>
            <div className="rounded-2xl border border-primary/10 bg-background px-5 py-4 text-sm text-muted-foreground">
              <strong className="block text-foreground">
                Vision: A world where anyone can use data with confidence and
                purpose.
              </strong>
            </div>
          </div>
          <div className="space-y-4 rounded-3xl border border-primary/10 bg-background px-6 py-5 lg:col-span-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Why we exist
            </h3>
            <p className="text-sm text-muted-foreground">
              We connect curious people with mentors, collaborative projects,
              and product teams that ship real solutions. Fellows experiment,
              gather feedback from partners, and scale what works.
            </p>
            <div className="flex items-center gap-3 text-sm font-semibold text-primary">
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
