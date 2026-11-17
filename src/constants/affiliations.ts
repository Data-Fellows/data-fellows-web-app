// Single source of truth for the three companies whose names appear both on
// the homepage "Independent studio. Experienced people." section and next to
// individual founders on /people. Keeping the list here (instead of in each
// page) is what stops a future partner-style drift bug, like Utiva briefly
// going missing from the homepage's Training Partners list while already
// showing on /partners, from happening to these same three names.
//
// These are professional affiliations of individual team members, not Data
// Fellows clients or commercial partners -- never label this list "Trusted
// by" or "Our clients," and never attach a key to a person who didn't
// actually work there.
export type AffiliationKey = "pwc" | "cohere" | "andela";

export const affiliations: Record<AffiliationKey, { name: string }> = {
  pwc: { name: "PwC" },
  cohere: { name: "Cohere" },
  andela: { name: "Andela" },
};

export const affiliationOrder: AffiliationKey[] = ["pwc", "cohere", "andela"];
