import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const stats = [
  { label: "Members", value: "1.6k+" },
  { label: "Countries", value: "33+" },
  { label: "Pilots", value: "30+" },
];

export const Hero = () => {
  const router = useRouter();

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="min-h-screen flex items-center overflow-hidden"
    >
      <div className="w-full mx-auto max-w-7xl h-full items-center px-4 pt-24 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center h-full">
          {/* Left: copy */}
          <div className="lg:col-span-7">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-primary">
                Turning Data Into Clarity
              </span>

              <h1
                id="hero-heading"
                className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight"
              >
                Data that people understand. Outcomes that move business.
              </h1>

              <p className="mt-4 text-lg text-muted-foreground">
                The Data Fellows bring learners, mentors and builders together
                to ship real products and pilots -- turning insights into
                measurable growth for small businesses.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                  onClick={() => router.push("/community")}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90"
                >
                  Join the Ecosystem
                </button>

                <Link
                  href="https://www.inscend.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-transparent px-5 py-3 text-sm font-medium text-primary hover:bg-primary/5"
                >
                  Explore Inscend
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                {stats.map((s) => (
                  <div key={s.label} className="flex items-baseline gap-3">
                    <span className="text-2xl font-semibold text-primary">
                      {s.value}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: visual card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-sm">
              <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/5 bg-card text-card-foreground border border-primary/10">
                <div className="relative h-64 sm:h-72">
                  <Image
                    src="/images/inscrenddash.png"
                    alt="Data Fellows community"
                    fill
                    priority
                    className="object-cover"
                    sizes="(min-width: 1024px) 420px, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent dark:from-black/70" />
                </div>

                <div className="px-6 py-5">
                  <p className="text-sm font-semibold text-card-foreground">
                    Inscend - The decision layer for founders
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Turns your store's data and your own operating context into
                    the next right action -- no analyst needed.
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-popover flex items-center justify-center text-sm font-semibold text-popover-foreground">
                        DF
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-foreground">
                          Community Pilot
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Live now
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => router.push("/contact")}
                      className="rounded-full bg-[#001628] px-3 py-2 text-xs font-semibold text-white hover:bg-[#001628]/90"
                    >
                      Get Involved
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
