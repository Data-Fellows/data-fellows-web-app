import { CommunityLeadCard } from "@/components";
import LandingPageLayout from "@/layouts/landing-page";
import { motion } from "framer-motion";
import { FiLink } from "react-icons/fi";

const dataScienceLeads = [
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
    role: "Data Science Lead",
  },
  {
    name: "Blessing Oludele",
    image: "/images/community/Blessing.jpeg",
    linkedin: "https://www.linkedin.com/in/blessingoludele",
    role: "Data Science Lead",
  },
  {
    name: "Nerat Dazam",
    image: "/images/community/Nerat.jpeg",
    linkedin: "https://www.linkedin.com/in/nerat-dazam",
    role: "Data Science Lead",
  },
];

const dataAnalystLeads = [
  {
    name: "Tijani Ogbuade",
    image: "/images/community/Tijani.jpeg",
    linkedin: "https://www.linkedin.com/in/tijani-ogbuade",
    role: "Data Analyst Lead",
  },
  {
    name: "Agada Joshua",
    image: "/images/community/Agada.jpeg",
    linkedin: "https://www.linkedin.com/in/joshua-agada",
    role: "Data Analyst Lead",
  },
];

const dataEngineeringLeads = [
  {
    name: "Oyindamola Victor",
    image: "/images/community/victor_cto.JPG",
    linkedin: "https://www.linkedin.com/in/oyindamolavictor/",
    role: "Data Engineering Lead",
  },
  {
    name: "Wuraola Akeeb",
    image: "/images/community/Wuraola.jpeg",
    linkedin: "https://www.linkedin.com/in/akeebwuraolaayomide",
    role: "Data Engineering Lead",
  },
];

export default function DataFellowsCommunityPage() {
  return (
    <LandingPageLayout>
      <div className="bg-background font-noto text-foreground">
        <section className="relative flex min-h-screen w-full items-center justify-center px-4 text-center overflow-hidden">
          <img
            src="/images/data-community-hero.jpg"
            alt="Data Fellows Community"
            className="absolute inset-0 h-full w-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-black/70 z-10"></div>
          <div className="relative z-20 rounded-lg p-6 text-white w-full flex flex-col items-center">
            <motion.h1
              className="mb-4 text-4xl font-bold md:text-5xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Data Fellows: Empowering Data Excellence Through Community
            </motion.h1>
            <motion.p
              className="mx-auto mb-6 max-w-3xl text-lg text-white md:text-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Connecting over 1,300+ Data Engineers, Data Analysts, Data
              Scientists, and ML Engineers in a thriving hub of knowledge and
              innovation.
            </motion.p>
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <a
                href="https://bit.ly/m/datafellows"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground shadow transition hover:bg-primary/90"
              >
                <FiLink className="h-5 w-5" />
                Join Data Fellows Community
              </a>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <motion.h2
            className="mb-4 text-3xl font-bold"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Unlock Your Potential: What We Offer
          </motion.h2>
          <motion.p
            className="mb-12 max-w-2xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            At Data Fellows, we provide comprehensive resources and a supportive
            environment to help you grow your skills and career.
          </motion.p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "📚",
                title: "Exclusive Data Repository",
                text: "Gain access to a curated collection of resources, tutorials, and insights specifically for data professionals.",
                href: "#",
              },
              {
                icon: "🎓",
                title: "Bootcamps & Scholarships",
                text: "Participate in intensive Data Analytics Bootcamps and apply for exclusive DataCamp scholarships to master new skills.",
                href: "#",
              },
              {
                icon: "🚀",
                title: "Internships & Career Perks",
                text: "Discover internship opportunities and leverage partnerships like Propel for upskilling and financial benefits.",
                href: "#",
              },
              {
                icon: "🤖",
                title: "AI for Small Businesses",
                text: "Join the waitlist for our AI-powered platform designed to help small businesses make smarter, data-driven decisions.",
                href: "#",
              },
            ].map(({ icon, title, text, href }, i) => (
              <motion.div
                key={title}
                className="rounded-xl bg-card text-card-foreground shadow-md p-6 flex flex-col"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                viewport={{ once: true }}
              >
                <div className="mb-4 text-4xl">{icon}</div>
                <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                <p className="mb-4 text-muted-foreground">{text}</p>
                {href && (
                  <a
                    href={href}
                    className="mt-auto inline-block rounded border border-primary px-4 py-2 text-primary transition hover:bg-primary hover:text-primary-foreground"
                  >
                    Learn More
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        <section className="bg-muted px-6 py-20">
          <div className="mx-auto max-w-5xl text-center">
            <motion.h2
              className="mb-4 text-3xl font-bold"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Connect, Learn, and Grow with Data Fellows
            </motion.h2>
            <motion.p
              className="mb-8 text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Our 1,300+ members are actively sharing knowledge, solving
              challenges, and networking across diverse data domains.
            </motion.p>
            <motion.ul
              className="mx-auto max-w-2xl space-y-4 text-left text-base"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <li>
                💬 <strong>Dynamic Discussions:</strong> Industry trends, best
                practices, and new technologies.
              </li>
              <li>
                🧩 <strong>Collaborative Problem-Solving:</strong> Support and
                shared expertise on real-world challenges.
              </li>
              <li>
                📅 <strong>Virtual Meetups & Events:</strong> Learn, network,
                and grow.
              </li>
              <li>
                👥 <strong>Peer-to-Peer Learning:</strong> Insights from
                professionals and rising talents.
              </li>
            </motion.ul>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <motion.h2
            className="mb-4 text-3xl font-bold"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Meet Our Community Leads
          </motion.h2>
          <motion.p
            className="mb-12 max-w-2xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Our community is led by passionate volunteers across Data Science,
            Data Analysis, and Data Engineering. Connect with them and get
            inspired!
          </motion.p>

          <div className="mb-10">
            <h3 className="mb-4 text-2xl font-semibold text-primary">
              Data Science Community Leads
            </h3>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {dataScienceLeads.map((lead, i) => (
                <CommunityLeadCard key={lead.name} {...lead} />
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h3 className="mb-4 text-2xl font-semibold text-primary">
              Data Analyst Community Leads
            </h3>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {dataAnalystLeads.map((lead, i) => (
                <CommunityLeadCard key={lead.name} {...lead} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-2xl font-semibold text-primary">
              Data Engineering Community Leads
            </h3>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {dataEngineeringLeads.map((lead, i) => (
                <CommunityLeadCard key={lead.name} {...lead} />
              ))}
            </div>
          </div>
        </section>

        <section className="relative px-6 py-16 text-center overflow-hidden">
          <img
            src="/images/team.jpg"
            alt="Join Data Fellows"
            className="absolute inset-0 h-full w-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <div className="relative z-20 flex flex-col items-center justify-center text-primary-foreground">
            <motion.h2
              className="mb-4 text-3xl font-bold"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Join Data Fellows Today!
            </motion.h2>
            <motion.p
              className="mx-auto mb-6 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Join our community and get access to our resources using our all
              in one link
            </motion.p>
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <a
                href="https://bit.ly/m/datafellows"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-2 rounded bg-secondary px-6 py-3 text-lg font-semibold text-secondary-foreground shadow transition hover:bg-secondary/80"
              >
                <FiLink className="h-5 w-5" />
                Join Data Fellows Community
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
}
