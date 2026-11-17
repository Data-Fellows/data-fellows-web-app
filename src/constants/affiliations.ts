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

// Logo files are each company's current official wordmark, sourced directly
// from their own site (cohere.com, andela.com) or, for PwC, the current
// 2025-rebrand mark via Wikimedia Commons after PwC's own site blocked
// automated fetches -- not a third-party "logo dump" site. Andela's source
// file is white-only (designed for their own dark site), so it renders
// inverted (invertOnLight) to read as a dark mark against our light chip
// background, and un-inverted again in dark mode.
export const affiliations: Record<
  AffiliationKey,
  { name: string; logo: string; invertOnLight?: boolean }
> = {
  pwc: { name: "PwC", logo: "/images/logos/pwc.svg" },
  cohere: { name: "Cohere", logo: "/images/logos/cohere.svg" },
  andela: { name: "Andela", logo: "/images/logos/andela.svg", invertOnLight: true },
};

export const affiliationOrder: AffiliationKey[] = ["pwc", "cohere", "andela"];
