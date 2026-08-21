import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { FiArrowRightCircle, FiUsers } from "react-icons/fi";

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
      <div className="mx-auto max-w-6xl rounded-3xl border border-primary/10 bg-secondary/10 px-6 py-12 lg:px-10 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="space-y-6 lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Community
            </span>
            <h2
              id="community-heading"
              className="text-3xl font-semibold text-foreground sm:text-4xl"
            >
              Learn, connect, and grow with others like you.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              The heart of Data Fellows is its people. We partner with DataCamp,
              Zummit Africa, and Vatebra Academy to offer quality training.
              Members join mentorship sessions, group projects, and live events
              that turn lessons into real experience.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl border border-primary/10 bg-background px-4 py-3">
                <p className="text-lg font-semibold text-foreground">600+</p>
                <p className="text-xs text-muted-foreground">
                  DataCamp scholarships in 2025
                </p>
              </div>
              <div className="rounded-2xl border border-primary/10 bg-background px-4 py-3">
                <p className="text-lg font-semibold text-foreground">900+</p>
                <p className="text-xs text-muted-foreground">
                  DataCamp scholarships in 2026
                </p>
              </div>
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
                    className={`rounded-2xl border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                      isActive
                        ? "border-primary bg-background shadow-sm"
                        : "border-primary/10 bg-background hover:border-primary/40"
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
                        className={`text-xs font-semibold uppercase tracking-wide ${
                          isActive ? "text-primary" : "text-muted-foreground"
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
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <FiUsers className="h-4 w-4" />
              Join the Community
            </button>
          </div>

          <div className="space-y-4 lg:col-span-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="group relative h-64 overflow-hidden rounded-3xl border border-primary/10 bg-background sm:h-52">
                <Image
                  src="/images/community/iyinoluwa-soleye.jpg"
                  alt="Iyinoluwa Soleye during a Fellows community session"
                  fill
                  sizes="(max-width: 768px) 50vw, 280px"
                  className="object-cover object-top transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="group relative h-64 overflow-hidden rounded-3xl border border-primary/10 bg-background sm:mt-6 sm:h-52">
                <Image
                  src="/images/community/favour-falade.jpg"
                  alt="Favour Falade sharing a pilot update"
                  fill
                  sizes="(max-width: 768px) 50vw, 280px"
                  className="object-cover object-top transition duration-500 group-hover:scale-105"
                />
              </div>
            </div>
            <div className="rounded-3xl border border-primary/10 bg-background px-6 py-5">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <FiArrowRightCircle className="h-5 w-5 text-primary" />
                <span>
                  Ready to collaborate? Head into the Discord, say hi, and join
                  a project squad today.
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
