export type StorySpotlight = {
  title: string;
  description: string;
  image: string;
  date: string;
  href: string;
  category?: string;
};

export type ResourceEntry = {
  title: string;
  description: string;
  image: string;
  href: string;
  category: "Guide" | "Lesson";
  date?: string;
};

export const storySpotlights: StorySpotlight[] = [
  {
    title: "The truth about getting your first Power BI gig",
    description:
      "Mubar Dauda breaks down the scope docs, pricing, and mindset shifts that helped him secure paid BI work.",
    image: "/images/mubar.jpg",
    date: "2025-11-07",
    href: "https://mubardauda.com/index.php/the-truth-about-getting-your-first-power-bi-gig-that-nobody-talks-about/",
    category: "Feature spotlight",
  },
  {
    title: "Detecting fraudulent transactions in real life",
    description:
      "Nafisa Idris shares a step-by-step walkthrough for designing and evaluating an advanced fraud detection workflow.",
    image: "/images/nafisa.jpg",
    date: "2025-02-19",
    href: "https://medium.com/@nafisaidris413/detecting-fraudulent-transactions-a-guide-to-building-an-advanced-fraud-detection-system-9e7506af55a4",
    category: "Feature spotlight",
  },
];

export const guides: ResourceEntry[] = [
  {
    title: "Navigating Opportunities in the Diaspora with Jessica Ayodele",
    description:
      "Highlights from Jessica's community session on mapping relocation paths, transferable skills, and sponsorship asks.",
    image: "/images/navigating.webp",
    href: "https://x.com/datafellowsinfo/status/1949109088433938940?s=46",
    category: "Guide",
    date: "2025-08-22",
  },
  {
    title: "Stand out as a potential hire: CVs do's and don'ts",
    description:
      "A practical tear-down on positioning your experience, quantifying wins, and presenting a readable CV.",
    image: "/images/cv.jpg",
    href: "https://youtu.be/jfPS1ifUQY0?si=6l50oxvuhp5fJiel",
    category: "Guide",
    date: "2025-07-05",
  },
];

export const lessons: ResourceEntry[] = [
  {
    title: "Practical ways small businesses can use data to grow",
    description:
      "Ikonik Magazine captures how we help founders turn lightweight dashboards into growth decisions.",
    image: "/images/first.jpg",
    href: "https://ikonikpress.com/practical-ways-small-businesses-can-use-data-to-grow/",
    category: "Lesson",
    date: "2025-03-01",
  },
  {
    title: "Avoiding common data mistakes",
    description:
      "Tobi Oladimeji's guide on the pitfalls he sees when SMEs stand up their first analytics stack.",
    image: "/images/second.jpg",
    href: "https://ikonikpress.com/avoiding-common-data-mistakes-by-tobi-oladimeji-for-ikonik-magazine/",
    category: "Lesson",
    date: "2025-01-18",
  },
  {
    title:
      "What building Data Fellows taught me about the human side of innovation",
    description:
      "Tobi Oladimeji reflects on why empathy -- not just data -- has driven Data Fellows' growth, and what that means for anyone building in tech.",
    image: "/images/tobi-beyond-data.webp",
    href: "https://ikonikpress.com/beyond-data-how-tobi-oladimeji-is-redefining-the-human-side-of-innovation/",
    category: "Lesson",
  },
  {
    title:
      "Why ecommerce brands lose revenue without realizing it -- and how decision intelligence fixes it",
    description:
      "Tobi Oladimeji shares how we use decision intelligence at Data Fellows to catch the hidden revenue leaks ecommerce brands often miss.",
    image: "/images/ecommerce-decision-intelligence.webp",
    href: "https://medium.com/@pressikonik/why-ecommerce-brands-lose-revenue-without-realizing-it-and-how-decision-intelligence-fixes-it-c74924c6b121",
    category: "Lesson",
  },
];

export const journeySoFarUrl =
  "https://x.com/datafellowsinfo/status/1976708564090540320?s=46";
