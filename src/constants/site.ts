export const SITE_URL = "https://www.datafellowsai.com";
export const SITE_NAME = "Data Fellows";
export const DEFAULT_OG_IMAGE = "/images/data-community-hero.jpg";
export const DEFAULT_DESCRIPTION =
  "Data Fellows trains, builds, and launches tools that turn data into clarity -- for people and businesses across 33+ countries.";

// Centralized outbound destinations and public claims, so numbers and links
// don't drift between pages -- extend this rather than hardcoding a new
// copy of any of these elsewhere.
export const site = {
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  foundingYear: "2022",
  email: "hello@datafellowsai.com",
  partnerEmail: "partners@datafellowsai.com",
  communityUrl: "https://bit.ly/m/datafellows",
  inscendUrl: "https://inscend.io",
  propelUrl: "https://datafellows.propel.community/auth",
  dataCampFormUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSdo9nAFByz0p_Dcp4bcZwDmM1qF0RBguN72pvNzfavFktW-Jw/viewform?usp=send_form",
  impactReportUrl: "/documents/data-fellows-impact-report-2026.pdf",
} as const;

// Public proof points -- keep every homepage/impact-page claim sourced from
// here instead of re-typing numbers per section, so they can't drift.
// as-of the 2026 Impact Report (four years, 2022-2026).
export const impactStats = [
  { value: 1600, suffix: "+", label: "Community members" },
  { value: 33, suffix: "", label: "Countries represented" },
  { value: 30, suffix: "+", label: "Ecosystem pilot projects launched" },
  { value: 1500, suffix: "+", label: "DataCamp scholarships since 2025" },
] as const;

export const extendedStats = [
  { value: "52+", label: "Sunday Catchups hosted" },
  { value: "60+", label: "Industry leaders spotlighted" },
  { value: "2,068", label: "Newsletter subscribers" },
  { value: "2,356 hrs", label: "DataCamp learning logged in 2026" },
  { value: "86%", label: "DataCamp license adoption" },
  { value: "50+", label: "Claude 101 Challenge participants" },
] as const;
