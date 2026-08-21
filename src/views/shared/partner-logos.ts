export interface PartnerLogo {
  id: number;
  name: string;
  logo: string;
  className?: string;
}

export const partnerLogos: PartnerLogo[] = [
  { id: 1, name: "AWS", logo: "/svgs/landing-page/aws-logo.png" },
  {
    id: 11,
    name: "Communitech",
    logo: "/images/communitech.png",
    className: "bg-black text-white",
  },
  { id: 9, name: "Data Rango", logo: "/svgs/landing-page/data-rango.png" },
  {
    id: 8,
    name: "League of Innovators",
    logo: "/svgs/landing-page/company1.png",
  },
  { id: 2, name: "Vatebra Academy", logo: "/svgs/landing-page/company2.svg" },
  {
    id: 7,
    name: "Microsoft for Startups",
    logo: "/svgs/landing-page/company3.svg",
  },
  {
    id: 4,
    name: "Data Analytics Elites Global Ltd",
    logo: "/svgs/landing-page/company4.svg",
  },
  { id: 5, name: "Zummit", logo: "/svgs/landing-page/company5.svg" },
  { id: 6, name: "Propel", logo: "/svgs/landing-page/company6.svg" },
  { id: 3, name: "DataCamp", logo: "/svgs/landing-page/company7.png" },
  {
    id: 10,
    name: "Everything Analytics",
    logo: "/svgs/landing-page/everything-analyticsi.png",
  },
  { id: 12, name: "TBDC", logo: "/images/partners/tbdc.png" },
  {
    id: 13,
    name: "Bhive",
    logo: "/images/partners/bhive.png",
    className: "bg-black text-white",
  },
  {
    id: 14,
    name: "Accelerator Centre",
    logo: "/images/partners/accelerator-centre.png",
  },
  {
    id: 15,
    name: "Innovation Factory",
    logo: "/images/partners/Innovation_Factory.webp",
  },
  {
    id: 16,
    name: "Vector Institute AI (Fastlane)",
    logo: "/images/partners/vector-institute-fastlane.png",
  },
];
