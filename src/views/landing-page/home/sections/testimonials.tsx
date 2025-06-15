import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaLinkedin } from "react-icons/fa";

const testimonials = [
  {
    name: "Gloria Oppong",
    title: "Co-Founder & CEO, Cleanster",
    quote:
      "Bizpilot AI by Data Fellows was very helpful in analyzing ways for us to streamline our data gathering towards property managers.",
    linkedin: "https://www.linkedin.com/in/gloria-oppong-70aa1138/",
  },
  {
    name: "Samuel Amoo",
    title: "",
    quote:
      "Data Fellows AI & matching capabilities with the ability to create a problem statement was really helpful.",
    linkedin:
      "https://www.linkedin.com/in/samuel-amoo?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
  },
  {
    name: "Alastair Odhiambo",
    title: "Co-founder & CTO, Sussed",
    quote:
      "I like how the BizPilot translates my problem and goal into a task in data terms.",
    linkedin:
      "https://www.linkedin.com/in/alastair-odhiambo?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, type: "spring" as const },
  },
  exit: { opacity: 0, y: -40, scale: 0.95, transition: { duration: 0.4 } },
};

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideInterval = 10000;

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
      }, slideInterval);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const getIndices = () => {
    const left = (current + testimonials.length - 1) % testimonials.length;
    const right = (current + 1) % testimonials.length;
    return [left, current, right];
  };

  const [leftIdx, centerIdx, rightIdx] = getIndices();

  return (
    <section
      className="relative bg-gradient-to-b from-background to-muted/20 py-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="md:container md:mx-auto md:px-6">
        <h2 className="mb-12 text-center font-noto text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          What Our Clients Say
        </h2>
        <div className="relative flex items-center justify-center gap-6">
          <div className="flex w-full max-w-5xl items-stretch justify-center gap-6">
            <motion.div
              key={leftIdx}
              className="hidden md:flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card p-6 shadow-lg w-1/3 opacity-60 scale-95"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <p className="mb-4 text-center font-noto text-base italic leading-relaxed text-muted-foreground">
                &ldquo;{testimonials[leftIdx].quote}&rdquo;
              </p>
              <div className="text-center">
                <p className="font-noto text-lg font-bold text-primary">
                  {testimonials[leftIdx].name}
                </p>
                {testimonials[leftIdx].title && (
                  <p className="font-noto text-xs text-muted-foreground">
                    {testimonials[leftIdx].title}
                  </p>
                )}
                <Link
                  href={testimonials[leftIdx].linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1 text-primary text-xs hover:bg-primary/20"
                >
                  <FaLinkedin className="h-4 w-4" />
                  <span>LinkedIn</span>
                </Link>
              </div>
            </motion.div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={centerIdx}
                className="flex flex-col items-center justify-center rounded-xl border border-primary/30 bg-card p-8 shadow-2xl w-full md:w-1/3 z-10"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "spring", duration: 0.6 }}
              >
                <p className="mb-6 text-center font-noto text-lg italic leading-relaxed text-foreground">
                  &ldquo;{testimonials[centerIdx].quote}&rdquo;
                </p>
                <div className="text-center">
                  <p className="font-noto text-2xl font-bold text-primary">
                    {testimonials[centerIdx].name}
                  </p>
                  {testimonials[centerIdx].title && (
                    <p className="font-noto text-sm text-muted-foreground">
                      {testimonials[centerIdx].title}
                    </p>
                  )}
                  <Link
                    href={testimonials[centerIdx].linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary/10 px-4 py-2 font-noto text-primary transition-all duration-300 hover:bg-primary/20 hover:text-accent-foreground"
                  >
                    <FaLinkedin className="h-5 w-5" />
                    <span>LinkedIn Profile</span>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
            <motion.div
              key={rightIdx}
              className="hidden md:flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card p-6 shadow-lg w-1/3 opacity-60 scale-95"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <p className="mb-4 text-center font-noto text-base italic leading-relaxed text-muted-foreground">
                &ldquo;{testimonials[rightIdx].quote}&rdquo;
              </p>
              <div className="text-center">
                <p className="font-noto text-lg font-bold text-primary">
                  {testimonials[rightIdx].name}
                </p>
                {testimonials[rightIdx].title && (
                  <p className="font-noto text-xs text-muted-foreground">
                    {testimonials[rightIdx].title}
                  </p>
                )}
                <Link
                  href={testimonials[rightIdx].linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1 text-primary text-xs hover:bg-primary/20"
                >
                  <FaLinkedin className="h-4 w-4" />
                  <span>LinkedIn</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="mt-8 flex justify-center gap-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                index === current
                  ? "scale-150 bg-primary"
                  : "bg-muted/50 hover:bg-muted"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
