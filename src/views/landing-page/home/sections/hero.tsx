import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { useRouter } from "next/router";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";

const ecosystem = [
  {
    title: "Community",
    description: "Learn with people who care about real-world impact.",
  },
  {
    title: "Products",
    description: "Build tools like Inscend from challenges members face.",
  },
  {
    title: "Impact",
    description: "Launch pilots that help small businesses grow with data.",
  },
];

const Hero = () => {
  const router = useRouter();

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-secondary/70 via-white to-primary/5" />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:py-20 lg:grid-cols-12 lg:items-center lg:px-0">
        <div className="space-y-6 lg:col-span-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Turning data into clarity
          </span>
          <h1
            id="hero-heading"
            className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl"
          >
            Making data simple, useful, and human.
          </h1>
          <p className="text-lg text-muted-foreground">
            We are a global community of people learning, building, and creating
            tools that help small businesses grow -- starting with our flagship
            product, Inscend.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => router.push("/join")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              Join the Community
              <FiArrowUpRight className="h-4 w-4" />
            </button>
            <Link
              href="https://inscend.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
            >
              See Inscend
              <FiArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            Inclusion and purpose first -- every program is designed so anyone
            can succeed with data, no matter where they start.
          </p>
        </div>

        <div className="relative rounded-3xl border border-primary/10 bg-white/70 p-6 shadow-xl backdrop-blur-sm lg:col-span-6">
          <div className="overflow-hidden rounded-2xl border border-white/40">
            <Image
              src="/images/data-community-hero.jpg"
              alt="Data Fellows members collaborating"
              width={720}
              height={540}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {ecosystem.map((step, index) => (
              <Fragment key={step.title}>
                <div className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-secondary/70 px-4 py-3 shadow-sm">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <div className="max-w-[12rem]">
                    <p className="text-sm font-semibold text-foreground">
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < ecosystem.length - 1 && (
                  <FiArrowRight className="hidden h-4 w-4 text-primary/60 sm:block" />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
