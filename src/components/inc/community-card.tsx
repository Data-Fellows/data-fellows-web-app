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
      className="rounded-xl bg-card text-card-foreground shadow-md transition-shadow duration-300 hover:shadow-lg flex flex-col items-center p-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <img
        src={image}
        alt={`Profile image of ${name}`}
        className="mb-4 h-28 w-28 rounded-full border-2 object-cover"
      />
      <h4 className="text-lg font-semibold">{name}</h4>
      <p className="mb-2 text-sm text-muted-foreground">{role}</p>
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-sm text-primary hover:underline"
      >
        <FaLinkedin className="mr-1" />
        LinkedIn
      </a>
    </motion.div>
  );
};
