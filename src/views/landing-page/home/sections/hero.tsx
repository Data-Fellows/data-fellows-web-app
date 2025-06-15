import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiBriefcase, FiUser } from "react-icons/fi";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80 },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1 },
  },
};

export default function Hero() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/images/hero.jpg"
          alt="Hero background"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
          quality={75}
        />
      </motion.div>

      <div className="relative z-10 flex min-h-screen bg-black/70 items-center justify-center pt-10 text-white">
        <main className="relative mx-1 pb-24 pt-16 text-center md:container md:mx-auto md:px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="md:mx-auto md:max-w-4xl"
          >
            <motion.div
              variants={fadeUp}
              className="mb-8 inline-flex items-center rounded-full border-4 border-muted-foreground/10 border-opacity-90 bg-muted-foreground/5 bg-opacity-20 px-2 py-1 font-bold"
            >
              <span className="rounded-full bg-primary px-4 py-1 text-sm">
                New here?
              </span>
              <span className="px-3">Sign Up now as a</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mb-6 text-4xl font-bold leading-tight md:text-6xl"
            >
              Affordable Data Analytics Solutions Powered by
              <span className="w-44 text-primary">AI</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mb-12 text-xl text-white font-light"
            >
              Powerful, self-serve product and growth analytics. Welcome to
              DataFellows with BizPilot AI integration.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex w-full flex-col items-center justify-center gap-6 sm:flex-row max-sm:w-[80%] max-sm:mx-auto"
            >
              <button
                className="w-full flex items-center justify-center gap-2 rounded cursor-pointer bg-primary px-6 py-3 text-primary-foreground font-semibold shadow hover:bg-primary/80 transition sm:w-auto"
                onClick={() => router.push("/sign-up?type=data-professional")}
              >
                <FiUser className="w-5 h-5" />
                Data Professional
              </button>
              <button
                className="w-full flex items-center justify-center gap-2 rounded cursor-pointer bg-primary px-6 py-3 text-primary-foreground font-semibold shadow hover:bg-primary/80 transition sm:w-auto"
                onClick={() => router.push("/sign-up?type=business-owner")}
              >
                <FiBriefcase className="w-5 h-5" />
                Business Owner
              </button>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
