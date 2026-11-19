import Highlight from "@/components/custom/highlight";
import { formatCompactStat, impactStats } from "@/constants/site";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// Short labels for the tight hero card -- numbers are still derived from
// impactStats (the canonical source) so they can't drift from the fuller
// stat band shown later on the page.
const stats = [
  { label: "Members", value: formatCompactStat(impactStats[0]) },
  { label: "Countries", value: formatCompactStat(impactStats[1]) },
  { label: "Projects", value: formatCompactStat(impactStats[2]) },
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export const Hero = () => {
  const router = useRouter();
  // Default to the SSR-safe "motion allowed" behavior and only switch to
  // the reduced-motion behavior after mount -- useReducedMotion() can
  // resolve synchronously to the real device preference on the client's
  // very first render while SSR always assumes motion is allowed, and
  // feeding that straight into `initial`/`animate` produces a client/server
  // markup mismatch (same issue already fixed in Reveal and
  // animated-counter.tsx).
  const prefersReduced = useReducedMotion();
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(Boolean(prefersReduced));
  }, [prefersReduced]);

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="overflow-hidden"
    >
      <div className="w-full mx-auto max-w-7xl px-4 pt-32 pb-12 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7">
            <motion.div
              className="max-w-2xl"
              initial={reduced ? undefined : "hidden"}
              animate={reduced ? undefined : "visible"}
              variants={container}
            >
              <motion.span
                variants={item}
                className="block font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Independent automation studio
              </motion.span>

              <motion.h1
                variants={item}
                id="hero-heading"
                className="mt-6 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.08]"
              >
                We solve <Highlight>recurring operational problems</Highlight> with software, data and AI.
              </motion.h1>

              <motion.p
                variants={item}
                className="mt-5 text-lg leading-relaxed text-muted-foreground"
              >
                Data Fellows designs, builds, integrates and manages the
                automation systems complex organizations run on, wherever
                that kind of operational problem shows up.
              </motion.p>

              <motion.div
                variants={item}
                className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <button
                  onClick={() => router.push("/contact")}
                  className="inline-flex items-center justify-center bg-foreground px-6 py-3 text-sm font-semibold text-background hover:bg-foreground/90"
                >
                  Discuss a Problem
                </button>

                <Link
                  href="/work"
                  className="inline-flex items-center justify-center border border-foreground px-6 py-3 text-sm font-medium text-foreground hover:bg-foreground hover:text-background"
                >
                  Explore Our Work
                </Link>
              </motion.div>

              <motion.div
                variants={item}
                className="mt-10 flex flex-wrap gap-6 border-t border-border pt-6"
              >
                {stats.map((s) => (
                  <div key={s.label} className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-semibold text-foreground">
                      {s.value}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                      {s.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Right: visual card */}
          <motion.div
            className="lg:col-span-5"
            initial={reduced ? undefined : { opacity: 0, y: 14 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25, ease: "easeOut" }}
          >
            <div className="relative mx-auto max-w-md lg:max-w-sm">
              <div className="overflow-hidden border border-border bg-card text-card-foreground">
                <div className="relative h-64 sm:h-72">
                  <Image
                    src="/images/data-community-hero.jpg"
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
                    A global community of learners and builders
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Fellows learn together, test ideas, and ship real pilots
                    across the ecosystem.
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 flex items-center justify-center bg-popover text-sm font-semibold text-popover-foreground">
                        DF
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-foreground">
                          Data Fellows
                        </div>
                        <div className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                          Open to join
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => router.push("/contact")}
                      className="bg-brand-blue-fill px-3 py-2 text-xs font-semibold text-brand-blue-foreground hover:bg-brand-blue-fill/90"
                    >
                      Get Involved
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
