import { formatCompactStat, impactStats } from "@/constants/site";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const quotes = [
  {
    quote:
      "Beyond skills, Data Fellows has given me hope, clarity, and confidence in my data journey. And for that, I'm certain success is only a matter of time.",
    name: "Jeremiah Colman, Data Fellow",
    image: "/images/community/Blessing.jpeg",
  },
  {
    quote:
      "Family through and through. The connections, insights, and knowledge shared here have shaped the way I approach my career and goals.",
    name: "Hephzibah Otuene, Data Fellow",
    image: "/images/community/James.jpeg",
  },
];

// Numbers are derived from impactStats (the canonical source) so they
// can't drift from the fuller stat band shown later on the page.
const stats = [
  { value: formatCompactStat(impactStats[0]), label: "Members" },
  { value: formatCompactStat(impactStats[1]), label: "Countries" },
  {
    value: formatCompactStat(impactStats[2]),
    label: "Projects & business engagements",
  },
];

const statAccentClasses = [
  { card: "border-border bg-background", value: "text-foreground" },
  { card: "border-border bg-background", value: "text-foreground" },
  { card: "border-border bg-background", value: "text-foreground" },
];

const WhoWeAre = () => {
  return (
    <section
      id="who-we-are"
      className="px-4 sm:px-6"
      aria-labelledby="who-we-are-heading"
    >
      <div className="mx-auto max-w-6xl space-y-10 lg:space-y-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="space-y-6 lg:col-span-6">
            <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
Where This Started
            </span>
            <h2
              id="who-we-are-heading"
              className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              This started with a community.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Data Fellows began in 2022 with people learning data together.
              Some of those relationships became long-term collaborations,
              projects and a technical team.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              The community still matters as we take on more difficult work.
              Today it has grown to over {impactStats[0].value.toLocaleString()}
              {impactStats[0].suffix} members across {impactStats[1].value}
              {impactStats[1].suffix} countries, with {impactStats[2].value}
              {impactStats[2].suffix} ecosystem projects and business
              engagements along the way.
            </p>
            <div className="space-y-4">
              {quotes.map((item) => (
                <blockquote
                  key={item.quote}
                  className="border border-border bg-card px-5 py-4 text-sm text-card-foreground"
                >
                  <p className="font-semibold">"{item.quote}"</p>
                  <span className="mt-2 block font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    {item.name}
                  </span>
                </blockquote>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="group relative h-72 overflow-hidden border border-border bg-background sm:h-64">
                <Image
                  src="/images/community/osaretin-ebuehi.jpg"
                  alt="Osaretin Ebuehi sharing a build update"
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover object-top grayscale transition duration-500 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="group relative h-72 overflow-hidden border border-border bg-background sm:mt-10 sm:h-64">
                <Image
                  src="/images/community/BISMA.jpg"
                  alt="Bisma Aji Manggala-Process Engineer"
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover object-top grayscale transition duration-500 group-hover:scale-105"
                  style={{ objectPosition: "center 25%" }}
                />
              </div>
              <div className="group relative h-72 overflow-hidden border border-border bg-background sm:-mt-10 sm:h-64">
                <Image
                  src="/images/community/Yumna-BigDatafacilitator.jpg"
                  alt="Yumna Gamal collaborating with Fellows"
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover object-top grayscale transition duration-500 group-hover:scale-105"
                  style={{ objectPosition: "center 25%" }}
                />
              </div>
              <div className="group relative h-72 overflow-hidden border border-border bg-background sm:h-64">
                <Image
                  src="/images/community/chiamaka-aniagor.jpg"
                  alt="Chiamaka Aniagor during a Fellows showcase"
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover object-top grayscale transition duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
          {stats.map((stat, index) => {
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

        <div className="text-center">
          <Link
            href="/documents/data-fellows-impact-report-2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:underline"
          >
            Read our four-year Impact Report
            <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;

