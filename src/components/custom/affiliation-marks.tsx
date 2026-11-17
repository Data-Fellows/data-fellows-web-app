import { affiliations, type AffiliationKey } from "@/constants/affiliations";
import Image from "next/image";

// Each mark sits in a small, always-white chip so a single-color logo file
// (Andela's is white-only, built for their own dark site) stays visible
// regardless of our page's light/dark theme, the same fixed-background
// pattern the partner-logo-carousel already uses for the same reason.
const sizeClasses = {
  sm: "h-7 px-2.5",
  md: "h-9 px-3.5",
} as const;

const imgSizeClasses = {
  sm: "h-3.5",
  md: "h-5",
} as const;

export const AffiliationMarks = ({
  keys,
  size = "sm",
  className = "",
}: {
  keys: AffiliationKey[];
  size?: keyof typeof sizeClasses;
  className?: string;
}) => {
  if (keys.length === 0) return null;
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {keys.map((key) => {
        const affiliation = affiliations[key];
        return (
          <span
            key={key}
            className={`inline-flex items-center justify-center border border-border bg-white ${sizeClasses[size]}`}
          >
            <Image
              src={affiliation.logo}
              alt={`${affiliation.name} logo`}
              width={120}
              height={32}
              className={`w-auto object-contain ${imgSizeClasses[size]} ${
                affiliation.invertOnLight ? "invert" : ""
              }`}
            />
          </span>
        );
      })}
    </div>
  );
};

export default AffiliationMarks;
