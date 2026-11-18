import type { ReactNode } from "react";

// A literal marker-highlight behind a phrase, the one editorial device we
// borrowed directly from Otherhalf (otherhalf.studio) when studying it for
// this redesign. Kept to our own brand-blue instead of their yellow, and
// used sparingly -- one phrase per heading, never the whole line -- so it
// reads as a deliberate, human accent rather than decoration.
export const Highlight = ({ children }: { children: ReactNode }) => (
  <span
    className="bg-brand-blue-fill/25 px-[0.15em] py-[0.05em]"
    style={{
      borderRadius: "0.2em 0.6em 0.3em 0.5em",
      boxDecorationBreak: "clone",
      WebkitBoxDecorationBreak: "clone",
    }}
  >
    {children}
  </span>
);

export default Highlight;
