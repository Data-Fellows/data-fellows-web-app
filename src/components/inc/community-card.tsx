import { motion } from "framer-motion";
import { FaLinkedin } from "react-icons/fa";

export const CommunityLeadCard = ({
  name,
  image,
  linkedin,
  role,
}: {
  name: string;
  image: string;
  linkedin: string;
  role: string;
}) => {
  return (
    <motion.div
      className="flex flex-col items-center rounded-xl border border-primary/10 bg-card p-6 text-card-foreground transition-transform duration-300 hover:-translate-y-1"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <img
        src={image}
        alt={`Profile image of ${name}`}
        className="mb-4 h-28 w-28 rounded-full border-2 object-cover object-top"
      />
      <div className="flex w-full items-center gap-3">
        <div className="flex-1 text-center">
          <h4 className="text-lg font-semibold">{name}</h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`LinkedIn profile of ${name}`}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 text-primary transition hover:bg-primary hover:text-primary-foreground"
        >
          <FaLinkedin className="h-4 w-4" />
        </a>
      </div>
    </motion.div>
  );
};
