// The single partner-network classification used everywhere it's shown
// (Home, /partners) -- previously the Home section and /partners each
// kept their own near-duplicate copy of this list, with slightly
// different category names and descriptions that could drift out of
// sync. These categories describe the kind of relationship, not a
// uniform "partnership": a self-serve startup-credit program (AWS,
// Microsoft) is a different relationship than a training academy whose
// curriculum we use, which is different again from a community ally who
// shares our work. This reflects the kind of relationship each program
// publicly offers; it is not a claim about which are still currently
// active -- that needs founder confirmation line by line.
export const partnerCategories = [
  {
    title: "Training & Education Partners",
    description:
      "Academies and learning platforms whose curriculum, classroom tools or mentorship programs Data Fellows has drawn on for its community.",
    partners: [
      "DataCamp Classroom",
      "Zummit Africa",
      "Vatebra Academy",
      "Cisco Networking Academy",
      "Data Rango",
      "Utiva",
    ],
  },
  {
    title: "Accelerator & Startup Programs",
    description:
      "Startup-support programs and innovation hubs Data Fellows has been part of, typically self-serve memberships rather than negotiated partnerships.",
    partners: [
      "AWS Startups",
      "Microsoft for Startups",
      "Communitech",
      "Accelerator Centre",
      "TBDC",
      "Bhive",
      "Innovation Factory",
      "League of Innovators",
      "Vector Institute AI (Fastlane)",
      "LVLUP Ventures",
    ],
  },
  {
    title: "Community Allies",
    description:
      "Communities and media allies who've amplified our stories, sessions, or talent, not commercial or contractual partners.",
    partners: ["Everything Analytics", "Propel", "DaElites"],
  },
];
