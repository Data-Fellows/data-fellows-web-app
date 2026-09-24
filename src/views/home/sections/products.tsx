import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowUpRight, FiPause, FiPlay, FiStar } from "react-icons/fi";

const features = [
  {
    title: "Action Board",
    description:
      "Every morning, a short list of prioritized actions -- each with its potential revenue impact -- so founders always know the next right move.",
  },
  {
    title: "Impact Dashboard",
    description:
      "See the outcome of every action you take, from restocks to campaign tweaks, so you know what is actually moving revenue.",
  },
  {
    title: "Built with Fellows",
    description:
      "Inscend was prototyped and stress-tested with the businesses in our ecosystem, ensuring it solves practical challenges.",
  },
];

const productSlides = [
  {
    image: "/images/inscrenddash.png",
    title: "Inscend dark mode action board",
    caption:
      "Full-fidelity dark mode workspace matching the new mockup -- restock alerts, customer nudges, and margin insights in one view.",
  },
  {
    image: "/images/actioncard.png",
    title: "Inscend light mode workspace",
    caption:
      "Light theme dashboard that mirrors the updated mock: revenue, actions, and product stats ready for client-facing reviews.",
  },
  // {
  //   image: "/images/dp-dash.png",
  //   title: "Pilot metrics tracker",
  //   caption:
  //     "Breaks down experiments, notes, and ownership so partners can follow every pilot without extra spreadsheets.",
  // },
];

const SLIDE_DURATION = 6000;

const Products = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      return;
    }
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % productSlides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      id="products"
      className="px-4 sm:px-6"
      aria-labelledby="products-heading"
    >
      <div className="mx-auto max-w-6xl rounded-3xl bg-navy-deep px-6 py-12 text-navy-deep-foreground lg:px-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="space-y-6 lg:col-span-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
              Built from the community
            </span>
            <h2
              id="products-heading"
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Inscend turns business data into the next right action.
            </h2>
            <p className="text-base leading-relaxed text-navy-deep-foreground/70">
              We do not just learn -- we build. Inscend is the decision layer
              for founder-led commerce: it combines a brand's platform data
              with the operating context only a founder knows, then turns both
              into a short list of prioritized, ready-to-complete actions --
              no analyst required.
            </p>
            <div className="space-y-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                >
                  <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-gold">
                    <FiStar className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-navy-deep-foreground/70">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="https://inscend.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-foreground transition hover:bg-gold/90"
            >
              Explore Inscend.io
              <FiArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative lg:col-span-7">
            <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-black/20">
              {productSlides.map((slide, index) => (
                <div
                  key={slide.title}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === activeSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    className="object-cover"
                    sizes="(min-width: 1024px) 620px, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-background/90 px-4 py-3 text-xs text-muted-foreground backdrop-blur">
                    <p className="text-sm font-semibold text-foreground">
                      {slide.title}
                    </p>
                    <p>{slide.caption}</p>
                  </div>
                </div>
              ))}

              <div className="absolute bottom-4 right-4 flex items-center gap-3 rounded-full bg-background/90 px-4 py-2 text-xs font-semibold text-foreground backdrop-blur">
                <button
                  type="button"
                  aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
                  onClick={() => setIsPaused((prev) => !prev)}
                  className="rounded-full border border-border bg-background p-2 text-primary transition hover:border-primary"
                >
                  {isPaused ? (
                    <FiPlay className="h-4 w-4" />
                  ) : (
                    <FiPause className="h-4 w-4" />
                  )}
                </button>
                <div className="flex items-center gap-2">
                  {productSlides.map((_, index) => (
                    <button
                      key={`slide-dot-${index}`}
                      type="button"
                      aria-label={`Go to slide ${index + 1}`}
                      onClick={() => {
                        setActiveSlide(index);
                        setIsPaused(false);
                      }}
                      className={`h-2 w-6 rounded-full transition ${
                        index === activeSlide
                          ? "bg-primary"
                          : "bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
