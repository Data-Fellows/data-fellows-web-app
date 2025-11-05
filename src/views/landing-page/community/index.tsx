import { CommunityLeadCard } from "@/components";
import LandingPageLayout from "@/layouts/landing-page";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FiAward,
  FiBookOpen,
  FiCompass,
  FiServer,
  FiUsers,
} from "react-icons/fi";

const rhythm = [
  {
    title: "Community Sunday Catchup",
    cadence: "Every two weeks",
    description:
      "Interactive stand-ups featuring demos, open asks, and a quick celebration of weekly wins.",
  },
  {
    title: "Fireside Sessions",
    cadence: "Once a month",
    description:
      "Cozy, video-first chats with mentors unpacking a challenge and sharing actionable templates.",
  },
  {
    title: "Newsletter",
    cadence: "Every two weeks",
    description:
      "Inbox roundups that stitch together member stories, new guides, and curated opportunities.",
  },
  {
    title: "Journey So Far",
    cadence: "Last Friday of every month",
    description:
      "An audio-first spotlight revealing the behind-the-scenes of a Fellow's latest success.",
  },
];

type RhythmCardProps = {
  title: string;
  cadence: string;
  description: string;
};

const RhythmCard = ({ title, cadence, description }: RhythmCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      onClick={() => setIsOpen((prev) => !prev)}
      className={`rounded-2xl border px-5 py-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
        isOpen
          ? "border-primary bg-secondary/10 shadow-sm"
          : "border-primary/10 bg-secondary/10 hover:border-primary/40"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{cadence}</p>
        </div>
        <span
          className={`text-xs font-semibold uppercase tracking-wide ${
            isOpen ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {isOpen ? "Close" : "Read"}
        </span>
      </div>
      {isOpen ? (
        <p className="mt-3 text-xs text-muted-foreground">{description}</p>
      ) : null}
    </button>
  );
};

const programs = [
  {
    title: "Mentorship circles",
    description:
      "Small group coaching led by experienced Fellows to help you ship your next data project.",
    icon: FiCompass,
  },
  {
    title: "Learning sprints",
    description:
      "Partner-led training pathways from DataCamp Classroom, Zummit Africa, and Vatebra Academy.",
    icon: FiBookOpen,
  },
  {
    title: "Products in public",
    description:
      "Collaborate with builders on Inscend and other pilot tools born from the community.",
    icon: FiServer,
  },
  {
    title: "Showcase nights",
    description:
      "Celebrate Fellows shipping something new -- from analytics dashboards to AI copilots.",
    icon: FiAward,
  },
];

const communityLeads = [
  {
    name: "James Ogunsanya",
    image: "/images/community/James.jpeg",
    linkedin: "https://www.linkedin.com/in/oyindamolajames",
    role: "Data Science Lead",
  },
  {
    name: "Ayodeji Ajayi",
    image: "/images/community/Ayodeji.jpeg",
    linkedin: "https://www.linkedin.com/in/ayodejiajayi1",
    role: "AI & Data Science Lead",
  },
  {
    name: "Blessing Oludele",
    image: "/images/community/Blessing.jpeg",
    linkedin: "https://www.linkedin.com/in/blessingoludele",
    role: "Product Analytics Lead",
  },
  {
    name: "Nerat Dazam",
    image: "/images/community/Nerat.jpeg",
    linkedin: "https://www.linkedin.com/in/nerat-dazam",
    role: "Data Strategy Lead",
  },
  {
    name: "Tijani Ogbuade",
    image: "/images/community/Tijani.jpeg",
    linkedin: "https://www.linkedin.com/in/tijani-ogbuade",
    role: "Analytics Community Lead",
  },
  {
    name: "Agada Joshua",
    image: "/images/community/Agada.jpeg",
    linkedin: "https://www.linkedin.com/in/joshua-agada",
    role: "Analytics Community Lead",
  },
  {
    name: "Oyindamola Victor",
    image: "/images/victor_cto.JPG",
    linkedin: "https://www.linkedin.com/in/oyindamolavictor/",
    role: "Engineering Community Lead",
  },
  {
    name: "Wuraola Akeeb",
    image: "/images/community/Wuraola.jpeg",
    linkedin: "https://www.linkedin.com/in/akeebwuraolaayomide",
    role: "Engineering Community Lead",
  },
];

const CommunityPage = () => {
  return (
    <LandingPageLayout>
      <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
        <section className="px-4 sm:px-6" aria-labelledby="community-hero-heading">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-primary/10 bg-secondary/10">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="space-y-6 px-6 py-12 lg:col-span-6 lg:px-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  The Data Fellows community
                </span>
                <h1
                  id="community-hero-heading"
                  className="text-3xl font-semibold text-foreground sm:text-4xl"
                >
                  Find people who build with data -- and cheer you on.
                </h1>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Whether you are a student experimenting, a professional
                  levelling up, or a founder launching your first product,
                  you&apos;ll meet people who share what they learn in public.
                </p>
                <Link
                  href="https://bit.ly/m/datafellows"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  <FiUsers className="h-4 w-4" />
                  Join us on Discord
                </Link>
              </div>
              <div className="relative h-full w-full lg:col-span-6">
                <div className="relative h-full min-h-[320px]">
                  <Image
                    src="/images/team.jpg"
                    alt="Data Fellows members at an event"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute bottom-4 left-4 rounded-2xl bg-background/90 px-4 py-3 text-xs text-muted-foreground backdrop-blur">
                    1000+ members across 15 countries and counting.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="community-programs-heading">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="text-center">
              <h2
                id="community-programs-heading"
                className="text-3xl font-semibold text-foreground sm:text-4xl"
              >
                Programs designed to keep you building.
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
                We co-create every program with members and partners so the
                learning never stops at theory.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {programs.map(({ title, description, icon: Icon }) => (
                <div
                  key={title}
                  className="flex h-full flex-col gap-4 rounded-3xl border border-primary/10 bg-background px-6 py-6"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="community-rhythm-heading">
          <div className="mx-auto max-w-6xl rounded-3xl border border-primary/10 bg-background px-6 py-10">
            <div className="space-y-6">
              <h2
                id="community-rhythm-heading"
                className="text-2xl font-semibold text-foreground sm:text-3xl"
              >
                Our rhythm
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {rhythm.map(({ title, cadence, description }) => (
                  <RhythmCard
                    key={title}
                    title={title}
                    cadence={cadence}
                    description={description}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="community-leads-heading">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="text-center">
              <h2
                id="community-leads-heading"
                className="text-3xl font-semibold text-foreground sm:text-4xl"
              >
                Meet our community leads.
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
                These are the people hosting conversations, unblocking projects,
                and cheering Fellows on.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {communityLeads.map((lead) => (
                <CommunityLeadCard key={lead.name} {...lead} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
};

export default CommunityPage;
