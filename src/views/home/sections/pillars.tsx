import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

const pillars = [
  {
    title: "Community",
    description:
      "A global network of professionals, learners, researchers and technology enthusiasts who share knowledge and support one another.",
    href: "/community",
    link: "Meet the community",
  },
  {
    title: "Learning",
    description:
      "Practical learning through scholarships, peer support, workshops, mentorship and technical conversations.",
    href: "/activities",
    link: "Explore programs",
  },
  {
    title: "Building",
    description:
      "Software, data systems, AI applications and experiments shaped by the skills and curiosity of our community.",
    href: "/work",
    link: "Explore projects",
  },
  {
    title: "Collaboration",
    description:
      "People and organizations connecting around shared questions, projects, research and professional opportunities.",
    href: "/partners",
    link: "Find ways to collaborate",
  },
  {
    title: "Impact",
    description:
      "Expanding access to technology learning, professional growth and meaningful contributions across the ecosystem.",
    href: "/impact",
    link: "See our impact",
  },
];

const Pillars = () => (
  <section
    id="pillars"
    className="px-4 sm:px-6"
    aria-labelledby="pillars-heading"
  >
    <div className="mx-auto max-w-6xl space-y-10">
      <div className="max-w-2xl space-y-3">
        <p className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
          What brings us together
        </p>
        <h2
          id="pillars-heading"
          className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        >
          Learn, build and grow together.
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          Community, learning, building, collaboration and impact are connected parts of how Data Fellows works.
        </p>
      </div>

      <div className="grid border-y border-border sm:grid-cols-2 lg:grid-cols-5">
        {pillars.map((pillar) => (
          <article
            key={pillar.title}
            className="flex flex-col border-b border-border py-6 sm:px-5 lg:border-b-0 lg:border-r lg:py-7 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
          >
            <h3 className="font-display text-xl font-semibold text-foreground">
              {pillar.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
              {pillar.description}
            </p>
            <Link
              href={pillar.href}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              {pillar.link}
              <FiArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Pillars;
