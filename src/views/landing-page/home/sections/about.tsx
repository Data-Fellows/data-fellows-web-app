import { easeOut, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaLightbulb, FaRocket } from "react-icons/fa";

const MotionButton = motion.button;

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easeOut,
      staggerChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

export default function About() {
  return (
    <motion.div
      className="lg:h-[70vh] md:h-full pb-20 flex items-center justify-center"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <main className="w-full px-4 sm:px-6 lg:px-20 py-8 md:py-4 ">
        <div className="flex flex-col lg:flex-row items-center justify-center">
          <div className="w-full lg:w-[70%] pr-0 lg:pr-16 space-y-12">
            <div className="space-y-6">
              <motion.h1
                className="text-4xl md:text-5xl font-bold text-left text-primary"
                variants={fadeUp}
              >
                About Us
              </motion.h1>
              <motion.div className="space-y-4 text-left" variants={fadeUp}>
                <h2 className="text-3xl md:text-4xl font-bold text-primary">
                  We Help To Get Solutions
                </h2>
                <p className="text-lg text-muted-foreground">
                  Discover the mission, vision, and values of Data Fellows, and
                  explore the innovative AI-powered tool, BizPilot, along with
                  the dedicated team driving Data Fellows forward.
                </p>
              </motion.div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-12">
              <motion.div className="space-y-4" variants={fadeUp}>
                <div className="flex items-start space-x-10">
                  <div className="w-16  flex items-center justify-center rounded-full ">
                    <FaRocket className="w-12 h-12 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary">
                      Mission & Vision
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Empowering businesses with tailored analytics solutions
                      and connecting them with skilled data professionals
                      through a community-driven platform.
                    </p>
                  </div>
                </div>
              </motion.div>
              <motion.div className="space-y-4" variants={fadeUp}>
                <div className="flex items-start space-x-10">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full ">
                    <FaLightbulb className="w-12 h-12 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary">
                      BizPilot AI
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Experience the unique AI-powered matching process that
                      simplifies finding the right talent for your data needs.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
            <motion.div className="flex justify-start" variants={fadeUp}>
              <Link href="/about">
                <MotionButton
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 24px 0 rgba(64, 144, 111, 0.15)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="w-[250px] cursor-pointer md:h-14 text-lg font-bold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition px-6 py-3 shadow"
                >
                  Our Team
                </MotionButton>
              </Link>
            </motion.div>
          </div>
          <motion.div
            className="w-full lg:w-[30%] mt-12 lg:mt-0 relative flex justify-center"
            variants={fadeUp}
          >
            <div className="rounded-lg overflow-hidden">
              <Image
                src="/svgs/landing-page/aboutwoman.svg"
                alt="Data Fellows team member"
                width={400}
                height={500}
                className="w-full h-auto object-cover rounded-2xl"
              />
            </div>
            <div className="absolute -bottom-24 w-[60%] -translate-x-1 rounded-lg shadow-2xl bg-background border p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary">
                  Data Fellows
                </h3>
                <p className="mt-1 text-muted-foreground">Looking for help?</p>
                <div className="mt-4 pt-4 border-t">
                  <p className="font-semibold text-center text-foreground">
                    Join us now and get the best Data Fellow to solve your
                    problems
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
}
