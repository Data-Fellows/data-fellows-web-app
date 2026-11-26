import Image from "next/image";
import Link from "next/link";
import { engineers, foundingTeam } from "@/views/shared/team";
import { FiExternalLink, FiLinkedin } from "react-icons/fi";

const TeamCard = ({
  name,
  role,
  tagline,
  image,
  linkedin,
  portfolio,
  featured,
  objectPosition,
}: {
  name: string;
  role: string;
  tagline: string;
  image: string;
  linkedin?: string;
  portfolio?: string;
  featured?: boolean;
  objectPosition?: string;
}) => {
  const imageHeightClass = featured ? "h-72 md:h-80" : "h-56";
  const cardWidthClass = featured ? "sm:col-span-2" : "";
  const imageSizes = featured
    ? "(max-width: 768px) 100vw, 320px"
    : "(max-width: 768px) 100vw, 240px";

  return (
    <div
      className={`flex h-full flex-col overflow-hidden border border-border bg-background ${cardWidthClass}`}
    >
      <div className={`relative ${imageHeightClass}`}>
        <Image
          src={image}
          alt={name}
          fill
          sizes={imageSizes}
          className="object-cover object-top grayscale"
          style={objectPosition ? { objectPosition } : undefined}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-base font-semibold text-foreground">
              {name}
            </p>
            <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              {role}
            </p>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            {portfolio ? (
              <Link
                href={portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center border border-border text-foreground transition hover:bg-foreground hover:text-background"
                aria-label={`Portfolio website of ${name}`}
              >
                <FiExternalLink className="h-4 w-4" />
              </Link>
            ) : null}
            {linkedin ? (
              <Link
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center border border-border text-foreground transition hover:bg-foreground hover:text-background"
                aria-label={`LinkedIn profile of ${name}`}
              >
                <FiLinkedin className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{tagline}</p>
      </div>
    </div>
  );
};

const TeamSection = () => {
  return (
    <section className="px-4" aria-labelledby="team-heading">
      <div className="mx-auto max-w-6xl space-y-16">
        <div className="space-y-4 text-center">
          <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
            02 &mdash; People
          </span>
          <h2
            id="team-heading"
            className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Meet the people who keep Data Fellows moving.
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            Meet the people who lead, advise and contribute to Data Fellows.
          </p>
          <Link
            href="/people"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-foreground underline underline-offset-4 hover:text-foreground/70"
          >
            Meet the full team &amp; advisors
          </Link>
        </div>

        <div className="space-y-6">
          <h3 className="font-display text-xl font-semibold text-foreground">
            Founding team
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {foundingTeam.map((person) => (
              <TeamCard key={person.name} {...person} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-display text-xl font-semibold text-foreground">
            Engineers
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {engineers.map((person) => (
              <TeamCard key={person.name} {...person} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
