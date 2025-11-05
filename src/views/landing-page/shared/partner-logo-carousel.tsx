import Image from "next/image";
import { useEffect, useRef } from "react";
import { partnerLogos } from "./partner-logos";

const duplicatedLogos = [...partnerLogos, ...partnerLogos, ...partnerLogos];

type PartnerLogoCarouselProps = {
  title?: string;
  description?: string;
  className?: string;
};

export const PartnerLogoCarousel = ({
  title = "Our partner network",
  description = "Discover the partners powering our reach, credibility, and shared pilots across continents.",
  className = "",
}: PartnerLogoCarouselProps) => {
  const logoRowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const row = logoRowRef.current;
    if (!row) return;

    let animationId: number | null = null;
    let scrollPosition = 0;
    const scrollSpeed = 0.9;

    const scrollLogos = () => {
      const segmentWidth = row.scrollWidth / 3 || row.scrollWidth;
      scrollPosition += scrollSpeed;

      if (segmentWidth > 0 && scrollPosition >= segmentWidth) {
        scrollPosition = 0;
      }

      row.style.transform = `translateX(-${scrollPosition}px)`;
      animationId = requestAnimationFrame(scrollLogos);
    };

    const start = () => {
      if (animationId !== null) cancelAnimationFrame(animationId);
      animationId = requestAnimationFrame(scrollLogos);
    };

    const pause = () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };

    const resume = () => {
      if (animationId === null) {
        start();
      }
    };

    start();

    row.addEventListener("mouseenter", pause);
    row.addEventListener("mouseleave", resume);
    row.addEventListener("touchstart", pause);
    row.addEventListener("touchend", resume);

    return () => {
      pause();
      row.style.transform = "";
      row.removeEventListener("mouseenter", pause);
      row.removeEventListener("mouseleave", resume);
      row.removeEventListener("touchstart", pause);
      row.removeEventListener("touchend", resume);
    };
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-primary/15 bg-primary/5 px-4 py-10 sm:px-8 sm:py-12 ${className}`}
    >
      <Image
        src="/svgs/landing-page/partner-spiral.svg"
        alt=""
        fill
        className="absolute inset-0 object-cover opacity-40"
        aria-hidden="true"
      />
      <div className="relative z-10 space-y-3 text-center">
        <h3 className="text-2xl font-semibold text-foreground sm:text-3xl">
          {title}
        </h3>
        <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>

      <div className="relative z-10 mt-8 overflow-hidden">
        <div
          ref={logoRowRef}
          className="flex w-max items-center whitespace-nowrap py-2 will-change-transform"
        >
          {duplicatedLogos.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className={`mx-3 flex h-24 w-40 items-center justify-center rounded-2xl bg-white p-4 text-sm shadow-md transition-colors sm:mx-4 sm:h-32 sm:w-52 sm:rounded-3xl sm:p-6 md:h-36 md:w-60 ${
                partner.id === 11 ? "bg-black text-white" : ""
              }`}
            >
              <div className="relative h-full w-full">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  fill
                  sizes="(max-width: 1024px) 220px, 260px"
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
