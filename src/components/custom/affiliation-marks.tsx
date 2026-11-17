import { affiliations, type AffiliationKey } from "@/constants/affiliations";

// Renders company names as plain typographic marks rather than logo
// graphics. We don't yet have authorized, on-brand logo files for PwC,
// Cohere or Andela -- third-party logo-dump sites turned up nothing we could
// confirm was current or permitted to use. Swap this for real logo images
// once the founder or each company's brand team provides approved assets;
// until then, naming the company in text carries none of that risk.
const sizeClasses = {
  sm: "px-2 py-1 text-[10px]",
  md: "px-3 py-1.5 text-xs",
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
      {keys.map((key) => (
        <span
          key={key}
          className={`border border-border font-mono font-semibold uppercase tracking-wide text-muted-foreground ${sizeClasses[size]}`}
        >
          {affiliations[key].name}
        </span>
      ))}
    </div>
  );
};

export default AffiliationMarks;
