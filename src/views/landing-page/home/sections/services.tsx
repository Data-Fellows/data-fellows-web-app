import { easeOut, motion } from "framer-motion";

export default function Services() {
  const serviceCards = [
    {
      id: 1,
      title: "Dashboard Development",
      description:
        "Unlock the power of data with basic and advanced analytics customized for small and medium-sized businesses.",
    },
    {
      id: 2,
      title: "AI Matching Platform",
      description:
        "Effortlessly connect your business with vetted data professionals through our innovative BizPilot AI technology.",
    },
    {
      id: 3,
      title: "Quality Assurance Process",
      description:
        "Rest assured with our vetted professionals and Gorilla Testing approach, ensuring top-notch quality for your analytics needs.",
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

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: easeOut },
    },
  };

  return (
    <motion.section
      className="relative overflow-hidden bg-primary/10 py-28"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="mb-4"></div>
      <img
        src="/svgs/landing-page/services-page-spiral.svg"
        className="absolute inset-0 z-0 hidden h-[100vh] w-[100vw] object-cover md:block"
        alt="Background spiral"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div className="mb-16 text-center" variants={cardVariants}>
          <h2 className="mb-4 text-5xl font-bold text-primary">Our Services</h2>
          <p className="mx-auto max-w-4xl text-lg text-muted-foreground">
            Explore Our Cutting-Edge Services Tailored For SMBs, Connecting
            Businesses With Top Professionals, And Ensuring Quality Through
            Rigorous Vetting Processes.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
        >
          {serviceCards.map((card) => (
            <motion.div
              key={card.id}
              className="rounded-3xl border border-primary/10 bg-background p-10 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              variants={cardVariants}
            >
              <h3 className="mb-4 text-2xl font-bold text-primary">
                {card.title}
              </h3>
              <p className="text-muted-foreground">{card.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
