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

export type ProductAdvisor = {
  name: string;
  role: string;
  description: string;
  image: string;
  linkedin?: string;
};

export type Product = {
  key: string;
  name: string;
  // Honest stage label for the editorial "status" device (handoff section
  // 6: Explored/Prototype/Pilot/Shipped/Operating/Archived). Exact date
  // ranges are intentionally left out until the founder confirms them --
  // see the redesign content-verification register.
  stage: string;
  // Work-index filter vocabulary from the handoff (Section 6): Product
  // Exploration, Community Project, Client Engagement, Managed Service.
  // Both current entries are self-initiated product exploration, not
  // client-commissioned work -- there's no paying-client engagement to
  // label honestly as one of the other types yet.
  workType: "Product Exploration";
  capabilities: string[];
  title: string;
  // What the project actually set out to do -- the "brief" on the /work
  // case study page -- kept distinct from `description` (the fuller
  // context/history) so the case study template can show both without
  // repeating itself.
  goal: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  slides: ProductSlide[];
  highlights: ProductHighlight[];
  // Advisors to this specific product -- not Data Fellows team members or
  // company advisors. Keep that distinction explicit wherever this renders.
  advisors?: ProductAdvisor[];
};

// Screenshots and copy shared between the homepage products section, the
// /work index, and each /work/[slug] case study, so none of them drift
// out of sync with each other.
export const products: Product[] = [
  {
    key: "bizpilot",
    name: "BizPilot AI",
    stage: "Explored",
    workType: "Product Exploration",
    capabilities: ["Software", "Data", "AI"],
    title: "Connecting data professionals with real opportunities.",
    goal: "Help data professionals get discovered for real opportunities, and give businesses a faster way to find vetted data talent for a scoped problem.",
    description:
      "BizPilot AI grew from our work helping data professionals build experience and connect with meaningful opportunities. The platform explored how professionals could showcase their skills, discover projects and opportunities, and engage with businesses looking for data expertise.",
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
    stage: "Explored",
    workType: "Product Exploration",
    capabilities: ["Software", "Data", "AI"],
    title: "AI-powered product and operating intelligence for ecommerce founders.",
    goal: "Give an independent ecommerce founder one place to see what needs attention each morning, with AI doing the investigation and the founder keeping the final call.",
    description:
      "Inscend helped independent ecommerce founders investigate what affects their products, identify improvements, and prepare actions across their business. It's a past Data Fellows product initiative that explored how AI could reduce the operational work involved in running an online store.",
    ctaLabel: "View our Product Hunt launch",
    ctaHref: site.inscendUrl,
    slides: [
      {
        image: "/images/inscend-dashboard-home.jpg",
        title: "Daily home dashboard",
        caption:
          "A morning view of stock, repeat orders, and the work ready for a founder to approve.",
      },
      {
        image: "/images/inscend-work-detail.png",
        title: "Proposed work, ready to approve",
        caption:
          "Each suggested change, like a product description, came with its reasoning and sources, waiting on a founder's approval.",
      },
    ],
    highlights: [
      {
        title: "Home dashboard",
        description:
          "Surfaced each product's key signals (stock, price, reviews) plus a queue of proposed fixes each morning.",
      },
      {
        title: "Evidence, not just suggestions",
        description:
          "Every proposed change came with the reasoning behind it: reviews, comparable products, and sources.",
      },
      {
        title: "Nothing changes without approval",
        description:
          "Proposed fixes, like an updated product description, waited for a founder's explicit approval before going live in Shopify.",
      },
    ],
    advisors: [
      {
        name: "Nnamdi Oboli",
        role: "Inscend Advisor · Co-Founder, Dioni Visions",
        description:
          "Brought an operator's perspective from building consumer businesses and producing film and media, advising on market strategy and partnerships.",
        image: "/images/Mr_Nnamdi Oboli-Co-Founder.jpg",
        linkedin: "https://www.linkedin.com/in/nnamdi-o-247a991a7/",
      },
      {
        name: "Oyeta Kokoroko",
        role: "Inscend Advisor · Founder, Maison OKOKO",
        description:
          "Advised on brand positioning and product understanding, drawing on her experience founding one of Canada's best-known clean beauty brands.",
        image: "/images/advisor.webp",
        linkedin: "https://www.linkedin.com/in/oy%C3%A9ta-kokoroko-9b52b6160",
      },
    ],
  },
];
