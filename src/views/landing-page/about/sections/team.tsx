import Image from "next/image";
import Link from "next/link";
import {
  advisors,
  communityAdmins,
  foundingTeam,
} from "@/views/landing-page/shared/team";
import { FiLinkedin } from "react-icons/fi";

const TeamCard = ({
  name,
  role,
  tagline,
  image,
  linkedin,
}: {
  name: string;
  role: string;
  tagline: string;
  image: string;
  linkedin?: string;
}) => (
  <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-primary/10 bg-background">
    <div className="relative h-56">
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width: 768px) 100vw, 240px"
        className="object-cover"
      />
    </div>
    <div className="flex flex-1 flex-col gap-2 px-5 py-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-foreground">{name}</p>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {role}
          </p>
        </div>
        {linkedin ? (
          <Link
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 text-primary transition hover:bg-primary hover:text-primary-foreground"
            aria-label={`LinkedIn profile of ${name}`}
          >
            <FiLinkedin className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
      <p className="text-sm text-muted-foreground">{tagline}</p>
    </div>
  </div>
);

const TeamSection = () => {
  return (
    <section className="px-4" aria-labelledby="team-heading">
      <div className="mx-auto max-w-6xl space-y-16">
        <div className="space-y-4 text-center">
          <h2
            id="team-heading"
            className="text-3xl font-semibold text-foreground sm:text-4xl"
          >
            Meet the people who keep Data Fellows moving.
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            Every leader in our ecosystem is grounded in community. They code,
            teach, and build side by side with Fellows.
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-foreground">
            Founding team
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {foundingTeam.map((person) => (
              <TeamCard key={person.name} {...person} />
            ))}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">
              Community leadership
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {communityAdmins.map((person) => (
                <TeamCard key={person.name} {...person} />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Advisors</h3>
            <div className="grid gap-6">
              {advisors.map((person) => (
                <TeamCard key={person.name} {...person} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
