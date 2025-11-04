import LandingPageLayout from "@/layouts/landing-page";
import Link from "next/link";
import {
  FiArrowRight,
  FiBookmark,
  FiHeadphones,
  FiPenTool,
} from "react-icons/fi";

const library = [
  {
    category: "Stories",
    description: "How Fellows use data to solve everyday problems.",
    icon: FiPenTool,
    items: [
      {
        title: "From classroom to pilot: Ruth's journey building credit tools",
        href: "#",
      },
      {
        title: "Inside the Lagos market pilots that shaped Inscend",
        href: "#",
      },
    ],
  },
  {
    category: "Guides",
    description: "Actionable playbooks built from partner sessions.",
    icon: FiBookmark,
    items: [
      {
        title: "Facilitating your first data discovery call",
        href: "#",
      },
      {
        title: "Designing AI workflows for small business teams",
        href: "#",
      },
    ],
  },
  {
    category: "Lessons",
    description: "What we learnt running 20 pilots across three continents.",
    icon: FiHeadphones,
    items: [
      {
        title: "Why small businesses struggle with messy data",
        href: "#",
      },
      {
        title: "Community rhythms that keep projects shipping",
        href: "#",
      },
    ],
  },
];

const ResourcesPage = () => {
  return (
    <LandingPageLayout>
      <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
        <section className="px-4" aria-labelledby="resources-hero-heading">
          <div className="mx-auto max-w-6xl rounded-3xl border border-primary/10 bg-secondary/10 px-6 py-12 lg:px-12">
            <div className="space-y-6 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                Resources
              </span>
              <h1
                id="resources-hero-heading"
                className="text-3xl font-semibold text-foreground sm:text-4xl"
              >
                Stories and lessons from real people building with data.
              </h1>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground">
                Dive into the guides, reflections, and conversations coming out
                of the Data Fellows ecosystem. Each piece is meant to be
                practical enough to use tomorrow.
              </p>
              <Link
                href="https://mailchi.mp/datafellowsai/newsletter"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Subscribe to the newsletter
                <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4" aria-labelledby="library-heading">
          <div className="mx-auto max-w-6xl space-y-10">
            <h2
              id="library-heading"
              className="text-3xl font-semibold text-foreground sm:text-4xl"
            >
              Explore the library
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {library.map(({ category, description, items, icon: Icon }) => (
                <div
                  key={category}
                  className="flex h-full flex-col gap-5 rounded-3xl border border-primary/10 bg-background px-6 py-6"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {category}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {description}
                    </p>
                  </div>
                  <ul className="space-y-3 text-sm">
                    {items.map(({ title, href }) => (
                      <li key={title}>
                        <Link
                          href={href}
                          className="inline-flex items-center gap-2 text-primary transition hover:text-primary/80"
                        >
                          {title}
                          <FiArrowRight className="h-4 w-4" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4" aria-labelledby="podcast-heading">
          <div className="mx-auto max-w-6xl rounded-3xl border border-primary/10 bg-background px-6 py-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <h2
                  id="podcast-heading"
                  className="text-2xl font-semibold text-foreground sm:text-3xl"
                >
                  Journey So Far -- our monthly audio stories
                </h2>
                <p className="text-sm text-muted-foreground">
                  Listen to Fellows share what they are building, the setbacks
                  they faced, and how the community helped them move forward.
                </p>
              </div>
              <Link
                href="#"
                className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
              >
                Listen to the latest episode
                <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
};

export default ResourcesPage;
