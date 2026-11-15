import { site } from "@/constants/site";

export type ProductSlide = {
  image: string;
  title: string;
  caption: string;
};

export type ProductHighlight = {
  title: string;
  description: string;
};

export type Product = {
  key: string;
  name: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  slides: ProductSlide[];
  highlights: ProductHighlight[];
};

// Screenshots and copy shared between the homepage products preview and the
// full /products page, so both stay in sync instead of drifting.
export const products: Product[] = [
  {
    key: "bizpilot",
    name: "BizPilot",
    title: "Connecting data professionals with real opportunities.",
    description:
      "BizPilot grew from our work helping data professionals build experience and connect with meaningful opportunities. The platform explored how professionals could showcase their skills, discover projects and opportunities, and engage with businesses looking for data expertise.",
    ctaLabel: "View our Product Hunt launch",
    ctaHref: site.productHuntUrl,
    slides: [
      {
        image: "/images/bizpilot-professional-dashboard.jpg",
        title: "Data professional dashboard",
        caption:
          "Profile completion, job matches, and applications in one view for data professionals.",
      },
      {
        image: "/images/bizpilot-company-dashboard.jpg",
        title: "Company dashboard",
        caption:
          "Businesses posted problems, reviewed Fellows' applications, and tracked payments.",
      },
    ],
    highlights: [
      {
        title: "Skill discovery",
        description:
          "Explored how a profile, a skills test, and work history could help a data professional stand out.",
      },
      {
        title: "Job matching",
        description:
          "Surfaced data roles from partner companies alongside each professional's profile.",
      },
      {
        title: "Problem marketplace",
        description:
          "Let businesses post real data problems for Fellows to apply to and solve.",
      },
    ],
  },
  {
    key: "inscend",
    name: "Inscend",
    title: "AI-powered product and operating intelligence for ecommerce founders.",
    description:
      "Inscend was developed to help independent ecommerce founders investigate what affects their products, identify improvements, and prepare actions across their business. The venture explored how AI could reduce the operational work involved in running an online store.",
    ctaLabel: "Explore Inscend",
    ctaHref: site.inscendUrl,
    slides: [
      {
        image: "/images/inscend-possible-causes.png",
        title: "Investigating a product's performance",
        caption:
          "Inscend surfaced possible causes behind a product's price, stock, and margin signals.",
      },
      {
        image: "/images/inscend-price-detail.png",
        title: "Clue-by-clue investigation",
        caption:
          "Each clue -- like price -- linked to its sources and a suggested next move.",
      },
    ],
    highlights: [
      {
        title: "Action Board",
        description:
          "Explored surfacing a short list of prioritized actions each morning, built from a founder's own data.",
      },
      {
        title: "Impact Dashboard",
        description:
          "Tracked the outcome of actions taken, from restocks to campaign tweaks.",
      },
      {
        title: "Built with Fellows",
        description:
          "Prototyped and stress-tested with the businesses in our ecosystem.",
      },
    ],
  },
];
