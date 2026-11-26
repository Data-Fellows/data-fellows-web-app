import { site } from "@/constants/site";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRightCircle } from "react-icons/fi";

const scholarshipStats = [
  { value: "900+", label: "DataCamp scholarships in 2025" },
  { value: "600+", label: "DataCamp scholarships in 2026" },
];

const statAccentClasses = [
  {
    card: "border-primary/30 bg-primary/10",
    value: "text-primary",
  },
  {
    card: "border-accent/30 bg-accent/10",
    value: "text-accent-foreground",
  },
];

const Community = () => {
  return (
    <section
      id="community"
      className="px-4 sm:px-6"
      aria-labelledby="community-heading"
    >
      <div className="mx-auto max-w-6xl border border-border bg-muted/40 px-6 py-12 lg:px-10 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="space-y-6 lg:col-span-6">
            <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
Community
            </span>
            <h2
              id="community-heading"
              className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              A community that keeps learning and building.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              People are the heart of Data Fellows. Members learn through scholarships, peer support, workshops and community conversations, and explore ways to build together.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {scholarshipStats.map((stat, index) => {
                const accent = statAccentClasses[index % statAccentClasses.length];
                return (
                  <div
                    key={stat.label}
                    className={`border px-5 py-6 text-center ${accent.card}`}
                  >
                    <p className={`font-display text-4xl font-semibold ${accent.value}`}>
                      {stat.value}
                    </p>
                    <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground/90">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={site.communityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-brand-blue-fill bg-brand-blue-fill px-6 py-3 text-sm font-semibold text-brand-blue-foreground transition hover:bg-brand-blue-fill/90"
              >
                Join the Community
              </Link>
              <Link
                href="/activities"
                className="inline-flex items-center gap-2 border border-foreground px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-foreground hover:text-background"
              >
                Explore programs and events
              </Link>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="group relative h-64 overflow-hidden border border-border bg-background sm:h-52">
                <Image
                  src="/images/community/iyinoluwa-soleye.jpg"
                  alt="Iyinoluwa Soleye during a Fellows community session"
                  fill
                  sizes="(max-width: 768px) 50vw, 280px"
                  className="object-cover object-top grayscale transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="group relative h-64 overflow-hidden border border-border bg-background sm:mt-6 sm:h-52">
                <Image
                  src="/images/community/favour-falade.jpg"
                  alt="Favour Falade sharing a pilot update"
                  fill
                  sizes="(max-width: 768px) 50vw, 280px"
                  className="object-cover object-top grayscale transition duration-500 group-hover:scale-105"
                />
              </div>
            </div>
            <div className="border border-border bg-background px-6 py-5">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <FiArrowRightCircle className="h-5 w-5 text-foreground" />
                <span>
                  Learn together, share what you know and explore collaboration at your own pace.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
