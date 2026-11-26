import { CommunityLeadCard } from "@/components";
import PageSeo from "@/components/seo/page-seo";
import { site } from "@/constants/site";
import LandingPageLayout from "@/layouts/landing-page";
import Image from "next/image";
import Link from "next/link";
import { FiAward, FiBookOpen, FiCompass, FiUsers } from "react-icons/fi";

const programs = [
  {
    title: "Learning and scholarships",
    description:
      "DataCamp learning, scholarship opportunities and other practical ways to grow your skills. Check the current activity listings for availability.",
    icon: FiBookOpen,
  },
  {
    title: "Mentorship and professional development",
    description:
      "Peer support, career conversations and mentorship activities that have helped members develop professionally.",
    icon: FiCompass,
  },
  {
    title: "Workshops and community conversations",
    description:
      "Technical sessions, Sunday Catchups, fireside conversations and member stories. Current dates appear on the activities page.",
    icon: FiUsers,
  },
  {
    title: "Collaborative technology projects",
    description:
      "Explore software, data, AI and research work in the project archive. Each entry identifies its contributors and origin.",
    icon: FiAward,
  },
];

type CommunityLead = {
  name: string;
  image: string;
  linkedin: string;
  role: string;
};

const communityLeadGroups: {
  title: string;
  description: string;
  leads: CommunityLead[];
}[] = [
  {
    title: "Founding Data Science Leads",
    description:
      "These contributors supported experiments across AI, machine learning and research-focused projects during earlier Data Fellows initiatives.",
    leads: [
      {
        name: "James Ogunsanya",
        image: "/images/community/James.jpeg",
        linkedin: "https://www.linkedin.com/in/oyindamolajames",
        role: "Founding Data Science Lead",
      },
      {
        name: "Blessing Oludele",
        image: "/images/community/Blessing.jpeg",
        linkedin: "https://www.linkedin.com/in/blessingoludele",
        role: "Founding Data Science Lead",
      },
      {
        name: "Nerat Dazam",
        image: "/images/community/Nerat.jpeg",
        linkedin: "https://www.linkedin.com/in/nerat-dazam",
        role: "Founding Data Science Lead",
      },
    ],
  },
  {
    title: "Founding Data Analytics Leads",
    description:
      "These contributors helped turn business questions into playbooks, dashboards and data storytelling resources for the community.",
    leads: [
      {
        name: "Tijani Ogbuade",
        image: "/images/community/Tijani.jpeg",
        linkedin: "https://www.linkedin.com/in/tijani-ogbuade",
        role: "Founding Data Analytics Lead",
      },
      {
        name: "Agada Joshua",
        image: "/images/community/Agada.jpeg",
        linkedin: "https://www.linkedin.com/in/joshua-agada",
        role: "Founding Data Analytics Lead",
      },
    ],
  },
  {
    title: "Founding Data Engineering Leads",
    description:
      "These contributors supported infrastructure, automation and technical experimentation across Data Fellows initiatives.",
    leads: [
      {
        name: "Oyindamola Victor",
        image: "/images/Oyindamola_Victor_cto.JPG",
        linkedin: "https://www.linkedin.com/in/oyindamolavictor/",
        role: "Founding Data Engineering Lead",
      },
      {
        name: "Wuraola Akeeb",
        image: "/images/community/Wuraola.jpeg",
        linkedin: "https://www.linkedin.com/in/akeebwuraolaayomide",
        role: "Founding Data Engineering Lead",
      },
    ],
  },
];

const CommunityPage = () => {
  return (
    <LandingPageLayout>
      <PageSeo
        title="Community | Data Fellows"
        description="Join Data Fellows, a global community of professionals, learners and builders who develop skills, collaborate and explore technology together."
        path="/community"
      />
      <div className="space-y-20 pt-28 md:space-y-24 md:pt-32">
        <section className="px-4 sm:px-6" aria-labelledby="community-hero-heading">
          <div className="mx-auto max-w-6xl overflow-hidden border border-border bg-muted/40">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="space-y-6 px-6 py-12 lg:col-span-6 lg:px-10">
                <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  The Data Fellows Community
                </span>
                <h1
                  className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
                >
                  Find people to learn, build and grow with.
                </h1>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Data Fellows welcomes aspiring and experienced professionals across data, AI, software, research and product development. Members share knowledge, learn together and explore ways to contribute.
                </p>
                <Link
                  href={site.communityUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
                >
                  <FiUsers className="h-4 w-4" />
                  Join the Community
                </Link>
              </div>
              <div className="relative h-full w-full lg:col-span-6">
                <div className="relative h-full min-h-[320px]">
                  <Image
                    src="/images/team.jpg"
                    alt="Data Fellows members at an event"
                    fill
                    className="object-cover grayscale"
                    priority
                  />
                  <div className="absolute bottom-4 left-4 border border-border bg-background/90 px-4 py-3 font-mono text-xs text-muted-foreground backdrop-blur">
                    1,600+ members across 33 countries.
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
                className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              >
                Ways to take part.
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
                Activities change over time. The current listings explain what is open, ongoing or concluded and how to participate.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {programs.map(({ title, description, icon: Icon }) => (
                <div
                  key={title}
                  className="flex h-full flex-col gap-4 border border-border bg-background px-6 py-6"
                >
                  <span className="flex h-12 w-12 items-center justify-center border border-foreground/20 text-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="community-activities-heading">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 border border-border bg-navy-deep px-6 py-10 text-navy-deep-foreground sm:flex-row sm:items-center sm:justify-between lg:px-10">
            <div className="max-w-2xl space-y-2">
              <h2 id="community-activities-heading" className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                See what is happening now.
              </h2>
              <p className="text-sm leading-6 text-navy-deep-foreground/75">
                Program pages show current status and participation details, including recurring learning and community activities.
              </p>
            </div>
            <Link
              href="/activities"
              className="inline-flex items-center justify-center border border-brand-blue bg-brand-blue-fill px-6 py-3 text-sm font-semibold text-brand-blue-foreground transition hover:bg-brand-blue-fill/90"
            >
              Explore programs and events
            </Link>
          </div>
        </section>

        <section className="px-4 sm:px-6" aria-labelledby="community-leads-heading">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="text-center">
              <h2
                id="community-leads-heading"
                className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              >
                Community contributors.
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
                Members have helped host conversations, support learning and contribute across Data Fellows activities over the years. These roles describe community contributions, not employment.
              </p>
            </div>
            <div className="space-y-10">
              {communityLeadGroups.map(({ title, description, leads }) => (
                <div key={title} className="space-y-6">
                  <div className="space-y-2 text-left">
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {description}
                    </p>
                  </div>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {leads.map((lead) => (
                      <CommunityLeadCard key={lead.name} {...lead} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
};

export default CommunityPage;
