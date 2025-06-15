import { motion } from "framer-motion";
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";
import { FiBriefcase, FiUser } from "react-icons/fi";
import { MdOutlineConnectWithoutContact } from "react-icons/md";

export default function OurTeam() {
  const teamMembers = [
    {
      id: 1,
      name: "Tobi Oladimeji",
      role: "Founder",
      description:
        "Enjoys adventurous travel, seeks new cultures and offbeat destinations",
      image: "/images/TOBI OLADIMEJI-FOUNDER.jpg",
      linkedin: "https://www.linkedin.com/in/tobioladimeji/",
    },
    {
      id: 2,
      name: "Nnamdi Oboli",
      role: "Co-Founder",
      description: "Pop music lover, seeks joy and exciting pop concerts",
      image: "/images/Mr Nnamdi Oboli-Co-Founder.jpg",
      linkedin: "https://www.linkedin.com/in/nnamdi-o-247a991a7/",
    },
    {
      id: 3,
      name: "Oyindamola Victor",
      role: "Chief Technology Officer",
      description: "Bookworm, creative software developer with precision",
      image: "/images/victor_cto.JPG",
      linkedin: "https://www.linkedin.com/in/oyindamolavictor/",
    },
    {
      id: 4,
      name: "Ayodeji Ajayi",
      role: "Head Of Artificial Intelligence",
      description:
        "Passionate about AI, enjoys exploring new technologies and their applications",
      image: "/images/community/Ayodeji.jpeg",
      linkedin: "https://www.linkedin.com/in/ayodejiajayi1",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-background/80 to-primary/10 pb-20 backdrop-blur-md text-foreground">
      <div className="min-h-screen overflow-hidden relative py-16">
        <div className="relative z-10 mx-auto max-w-[80%] px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center justify-center flex flex-col items-center">
            <span className="mb-10 inline-block h-6 bg-muted-foreground/5 px-2 py-1 text-sm text-primary rounded shadow-none">
              <Image
                src="/svgs/landing-page/people.svg"
                alt="Lightbulb icon"
                width={16}
                height={16}
                className="inline-block h-4 w-4 mr-1 align-text-bottom"
              />
              Our Team
            </span>
            <motion.h2
              className="mb-6 text-4xl font-bold text-foreground"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Meet our team members
            </motion.h2>
            <motion.p
              className="mx-auto max-w-2xl text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              We Focus on the details of everything we do. All to help
              businesses around the world Focus on what&apos;s most important to
              them.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <a
                href="/contact"
                className="mt-4 md:h-14 w-[200px] rounded-md bg-primary text-primary-foreground flex px-6 items-center justify-center font-semibold transition hover:bg-primary/90 space-x-2 text-center"
              >
                <span>Contact Us</span>
                <MdOutlineConnectWithoutContact className=" h-5 w-5 text-white" />
              </a>
            </motion.div>
          </div>
        </div>

        <div className="mx-auto grid grid-cols-1 gap-20 w-[80%] px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-0">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.id}
              className="overflow-hidden rounded-xl bg-background shadow-md text-foreground"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative h-64 w-full overflow-hidden rounded-t-xl">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiUser className="text-primary" />
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <FiBriefcase className="text-primary" />
                  <span>{member.role}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {member.description}
                </p>
                <div className="mt-3">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                    aria-label={`LinkedIn profile of ${member.name}`}
                  >
                    <FaLinkedin className="text-primary text-xl" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="mx-4 mt-16 max-w-full rounded-3xl text-white md:mx-auto md:max-w-[80vw] "
          style={{
            backgroundImage:
              "linear-gradient(to right, #2C6E8F, #1B3A4B), url('/svgs/landing-page/baseline.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col items-center justify-between p-6 md:flex-row md:p-12">
            <div className="mb-8 max-w-2xl md:mb-0 md:mr-8">
              <h2 className="mb-4 text-xl font-bold leading-tight md:text-4xl md:leading-[3.2rem]">
                Unlock the power of AI Data Analytics Solutions today
              </h2>
              <p className="text-base leading-relaxed md:text-lg">
                Explore our cutting-edge services tailored for SMBs, connecting
                businesses with top professionals, and ensuring quality through
                rigorous vetting processes.
              </p>
            </div>
            <a
              href="/"
              className="h-auto w-[250px] whitespace-nowrap rounded-md bg-primary px-8 py-3 text-lg font-medium text-primary-foreground md:py-4 text-center transition hover:bg-primary/90"
            >
              Get started
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
