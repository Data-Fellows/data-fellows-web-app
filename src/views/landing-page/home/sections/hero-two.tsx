import { easeOut, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiBriefcase, FiStar, FiUser } from "react-icons/fi";

const stats = [
  {
    id: 1,
    value: 1500,
    display: "1.5k+",
    description: "Join over 1k satisfied professionals!",
    icon: (
      <FiUser className="ml-2 w-6 h-6 text-primary dark:text-primary-foreground" />
    ),
  },
  {
    id: 2,
    value: 5,
    display: "5.0",
    description: "Rated 4.9/5 by our users!",
    icon: (
      <FiStar className="ml-2 w-6 h-6 text-yellow-400 dark:text-yellow-300" />
    ),
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      staggerChildren: 0.18,
      ease: easeOut,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

function AnimatedCounter({
  to,
  display,
  duration = 3,
}: {
  to: number;
  display: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    let start = 0;
    const end = to;
    const increment = end / (duration * 60);
    let current = start;
    let frame = 0;
    function animate() {
      frame++;
      current += increment;
      if (
        (increment > 0 && current >= end) ||
        (increment < 0 && current <= end)
      ) {
        setCount(end);
        return;
      }
      setCount(current);
      raf.current = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [to, duration]);

  if (display.endsWith("k+")) {
    return (
      <span className="text-4xl font-bold text-foreground dark:text-foreground">
        {`${(count / 1000).toFixed(1)}k+`}
      </span>
    );
  }
  return (
    <span className="text-4xl font-bold text-foreground dark:text-foreground">
      {count.toFixed(1)}
    </span>
  );
}

export default function HeroTwo() {
  return (
    <>
      <div className="h-14 bg-background"></div>
      <motion.section
        className="bg-primary/10 py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-20">
          <div className="flex flex-col items-center lg:flex-row">
            <motion.div
              className="mb-12 w-full pr-0 lg:mb-0 lg:w-1/2 lg:pr-12"
              variants={fadeUp}
            >
              <div className="md:w-[90%]">
                <motion.h1
                  className="mb-6 text-3xl font-bold leading-tight md:text-5xl text-primary dark:text-primary-foreground"
                  variants={fadeUp}
                >
                  For Data Professionals and Businesses/Companies
                </motion.h1>
                <motion.p
                  className="mb-10 text-lg text-muted-foreground dark:text-muted-foreground"
                  variants={fadeUp}
                >
                  Join Data Fellows today to connect with top-tier data
                  professionals who can help you make data-driven decisions and
                  improve your business performance.
                </motion.p>
                <motion.div
                  className="mb-16 flex flex-col gap-4 sm:flex-row"
                  variants={fadeUp}
                >
                  <Link href="/sign-up?type=data-professional">
                    <button className="h-14 w-full flex items-center justify-center gap-2 border border-primary rounded-md px-8 py-6 text-lg font-semibold bg-background text-primary hover:bg-primary hover:text-primary-foreground transition dark:bg-card dark:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground">
                      <FiUser className="w-6 h-6" />
                      Data Professional
                    </button>
                  </Link>
                  <Link href="/sign-up?type=business-owner">
                    <button className="h-14 w-full flex items-center justify-center gap-2 rounded-md px-8 py-6 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition dark:bg-primary dark:text-primary-foreground">
                      <FiBriefcase className="w-6 h-6" />
                      Business/Company
                    </button>
                  </Link>
                </motion.div>
                <motion.div
                  className="flex flex-col gap-16 sm:flex-row"
                  variants={fadeUp}
                >
                  {stats.map((stat) => (
                    <div key={stat.id} className="flex flex-col">
                      <div className="mb-1 flex items-center">
                        <AnimatedCounter
                          to={stat.value}
                          display={stat.display}
                          duration={3}
                        />
                        {stat.icon}
                      </div>
                      <p className="text-muted-foreground dark:text-muted-foreground">
                        {stat.description}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="w-full max-sm:hidden lg:w-1/2"
              variants={fadeUp}
            >
              <Image
                src="/images/dash.svg"
                alt="Data professionals in a meeting analyzing dashboard data"
                width={600}
                height={400}
                className="h-auto w-full rounded-xl"
              />
            </motion.div>
            <motion.div
              className="flex w-full flex-col gap-6 lg:hidden"
              variants={fadeUp}
            >
              <Image
                src="/images/dp-dash.svg"
                alt="Data Professional Dashboard"
                width={600}
                height={220}
                className="h-auto w-full rounded-xl"
              />
              <Image
                src="/images/company-dash.svg"
                alt="Company Dashboard"
                width={600}
                height={220}
                className="h-auto w-full rounded-xl"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>
    </>
  );
}
