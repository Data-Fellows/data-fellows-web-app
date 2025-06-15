import { useEffect, useRef } from "react";

interface Partner {
  id: number;
  name: string;
  logo: string;
}

export default function Partners() {
  const partnerLogos: Partner[] = [
    { id: 1, name: "AWS", logo: "/svgs/landing-page/aws-logo.png" },
    { id: 11, name: "Communitech", logo: "/images/communitech.png" },
    { id: 9, name: "Data Rango", logo: "/svgs/landing-page/data-rango.png" },
    {
      id: 8,
      name: "League of Innovators",
      logo: "/svgs/landing-page/company1.png",
    },
    { id: 2, name: "Vatebra Academy", logo: "/svgs/landing-page/company2.svg" },
    {
      id: 7,
      name: "Microsoft for Startups",
      logo: "/svgs/landing-page/company3.svg",
    },
    {
      id: 4,
      name: "Data Analytics Elites Global Ltd",
      logo: "/svgs/landing-page/company4.svg",
    },
    { id: 5, name: "Zummit", logo: "/svgs/landing-page/company5.svg" },
    { id: 6, name: "Propel", logo: "/svgs/landing-page/company6.svg" },
    { id: 3, name: "DataCamp", logo: "/svgs/landing-page/company7.png" },
    {
      id: 10,
      name: "Everything Analytics",
      logo: "/svgs/landing-page/everything-analyticsi.png",
    },
  ];

  const duplicatedLogos = [...partnerLogos, ...partnerLogos, ...partnerLogos];
  const logoRowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const logoRowElement = logoRowRef.current;
    if (!logoRowElement) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.9;

    const scrollLogos = () => {
      scrollPosition += scrollSpeed;
      if (scrollPosition >= logoRowElement.scrollWidth / 3) {
        scrollPosition = 0;
      }
      logoRowElement.style.transform = `translateX(-${scrollPosition}px)`;
      animationId = requestAnimationFrame(scrollLogos);
    };

    animationId = requestAnimationFrame(scrollLogos);

    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(scrollLogos);
    };

    logoRowElement.addEventListener("mouseenter", handleMouseEnter);
    logoRowElement.addEventListener("mouseleave", handleMouseLeave);

    const handleTouchStart = () => cancelAnimationFrame(animationId);
    const handleTouchEnd = () => {
      animationId = requestAnimationFrame(scrollLogos);
    };

    logoRowElement.addEventListener("touchstart", handleTouchStart);
    logoRowElement.addEventListener("touchend", handleTouchEnd);

    return () => {
      cancelAnimationFrame(animationId);
      logoRowElement.removeEventListener("mouseenter", handleMouseEnter);
      logoRowElement.removeEventListener("mouseleave", handleMouseLeave);
      logoRowElement.removeEventListener("touchstart", handleTouchStart);
      logoRowElement.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div>
      <div className="h-14"></div>
      <div className="relative overflow-hidden bg-primary/10 py-12 sm:py-16">
        <img
          src="/svgs/landing-page/partner-spiral.svg"
          className="absolute inset-0 z-0 h-full w-full object-cover md:block"
          alt="Background wave pattern"
        />
        <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center sm:mb-12">
            <h1 className="mb-3 text-3xl font-bold sm:mb-4 sm:text-4xl text-foreground dark:text-foreground">
              Our Partners
            </h1>
            <p className="mx-auto max-w-xl px-2 text-base sm:text-lg text-foreground dark:text-foreground">
              Discover Our Network Of Partners Who Contribute To Enhancing Our
              Platform&apos;s Credibility And Expanding Our Reach.
            </p>
          </div>

          <div className="relative mb-6 overflow-hidden sm:mb-10">
            <div
              ref={logoRowRef}
              className="flex w-max items-center whitespace-nowrap py-2"
            >
              {duplicatedLogos.map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  className={` ${
                    partner.id === 11 ? "bg-black" : ""
                  } mx-3 flex h-28 w-48 items-center justify-center rounded-2xl bg-secondary p-4 shadow-md sm:mx-4 sm:h-36 sm:w-56 sm:rounded-3xl sm:p-6 md:h-40 md:w-64`}
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="min-h-full min-w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
