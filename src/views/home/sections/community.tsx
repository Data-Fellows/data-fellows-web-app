import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { FiArrowRightCircle, FiUsers } from "react-icons/fi";

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

const rhythm = [
  {
    title: "Community Sunday Catchup",
    cadence: "Every two weeks",
    description:
      "Live check-ins where Fellows demo what they are building and ask for quick feedback.",
  },
  {
    title: "Fireside Sessions",
    cadence: "Once a month",
    description:
      "Intimate talks with partners and mentors that unpack a single theme with actionable prompts.",
  },
  {
    title: "Newsletter",
    cadence: "Every two weeks",
    description:
      "A curated inbox drop featuring templates, wins, and calls for collaborators.",
  },
  {
    title: "Journey So Far",
    cadence: "Stories from members -- last Friday monthly",
    description:
      "A rotating spotlight on a Fellow showing the behind-the-scenes of a recent success.",
  },
];

const Community = () => {
  const router = useRouter();
  const [activeRhythm, setActiveRhythm] = useState<string | null>(null);

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
              05 &mdash; Community
            </span>
            <h2
              id="community-heading"
              className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              A community that keeps learning and building.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              The heart of Data Fellows is its people. We partner with DataCamp,
              Zummit Africa, and Vatebra Academy to offer quality training.
              Members join mentorship sessions, group projects, and live events
              that turn lessons into real experience.
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
            <div className="grid gap-4 sm:grid-cols-2">
              {rhythm.map((item) => {
                const isActive = activeRhythm === item.title;
                return (
                  <button
                    key={item.title}
                    type="button"
                    aria-expanded={isActive}
                    onClick={() =>
                      setActiveRhythm((prev) =>
                        prev === item.title ? null : item.title
                      )
                    }
                    className={`border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                      isActive
                        ? "border-foreground bg-background"
                        : "border-border bg-background hover:border-foreground/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.cadence}
                        </p>
                      </div>
                      <span
                        className={`font-mono text-xs font-semibold uppercase tracking-wide ${
                          isActive ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {isActive ? "Open" : "Tap to read"}
                      </span>
                    </div>
                    {isActive ? (
                      <p className="mt-3 text-xs text-muted-foreground/90">
                        {item.description}
                      </p>
                    ) : null}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => router.push("/community")}
              className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              <FiUsers className="h-4 w-4" />
              Join the Community
            </button>
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
                  Ready to collaborate? Join the community and find a project
                  squad today.
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
