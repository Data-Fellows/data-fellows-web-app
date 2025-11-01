import Image from "next/image";
import Link from "next/link";
import { FiBookOpen, FiExternalLink } from "react-icons/fi";

const resources = [
  {
    title: "How Fellows prototyped Inscend with real shop owners",
    category: "Story",
    href: "/resources#inscend-story",
    image: "/images/community/Blessing.jpeg",
  },
  {
    title: "A mentor's guide to running data discovery calls",
    category: "Guide",
    href: "/resources#mentor-guide",
    image: "/images/community/Ayodeji.jpeg",
  },
  {
    title: "What we learnt after 20 pilot projects across 3 continents",
    category: "Lesson",
    href: "/resources#pilot-lessons",
    image: "/images/community/Agada.jpeg",
  },
];

const Resources = () => {
  return (
    <section
      id="resources"
      className="px-4"
      aria-labelledby="resources-heading"
    >
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="space-y-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Resources
          </span>
          <h2
            id="resources-heading"
            className="text-3xl font-semibold text-foreground sm:text-4xl"
          >
            Stories and lessons from real people.
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            Read how Fellows are learning, creating, and solving real problems.
            Our blog shares guides, stories, and project insights from members
            around the world.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {resources.map((resource) => (
            <article
              key={resource.title}
              className="group overflow-hidden rounded-3xl border border-primary/10 bg-background shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={resource.image}
                  alt={resource.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary shadow-sm backdrop-blur">
                  <FiBookOpen className="h-3.5 w-3.5" />
                  {resource.category}
                </span>
              </div>
              <div className="space-y-3 p-6">
                <h3 className="text-lg font-semibold text-foreground">
                  {resource.title}
                </h3>
                <Link
                  href={resource.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80"
                >
                  Explore resource
                  <FiExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
          >
            Explore Resources
            <FiExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Resources;
