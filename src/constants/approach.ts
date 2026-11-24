// The single client journey used everywhere it's shown (Home, Services,
// Approach, Contact) -- previously three different, differently-counted
// step lists existed across just two pages (this file's old 5-step
// processSteps and 7-step engagementTimeline, plus services/index.tsx's
// own separate 4-step procurementSteps), which made "how working with us
// goes" look different depending on which page you landed on. Content
// below consolidates them rather than inventing a new claim: each step's
// wording is carried over from whichever of those three said it best.
export const clientJourney = [
  {
    step: "01",
    title: "Tell us the problem",
    description:
      "You describe what's happening, what's been tried, and what a better outcome would look like.",
  },
  {
    step: "02",
    title: "Discovery conversation",
    description:
      "We ask questions and review your existing systems and constraints closely enough to scope real work, not a guess.",
  },
  {
    step: "03",
    title: "Scoped proposal",
    description:
      "A narrow, honest proposal: the smallest thing that actually solves the problem, its timeline and its price.",
  },
  {
    step: "04",
    title: "Agree on terms",
    description:
      "Delivery terms, IP and support arrangements set out plainly before work starts, including what's outside what we can currently support.",
  },
  {
    step: "05",
    title: "Build, implement & review",
    description:
      "We build directly with you, with clear deliverables and checkpoints along the way, not a black box until the end.",
  },
  {
    step: "06",
    title: "Handover or ongoing support",
    description:
      "A clean handover, or -- where it's part of the agreement -- we stay involved: monitoring, fixing, and improving what we shipped.",
  },
];

export const principles = [
  {
    title: "Evidence before big commitments",
    description:
      "We review your actual systems and talk to the people living with the problem before proposing anything substantial.",
  },
  {
    title: "The smallest responsible solution",
    description:
      "We scope narrowly: the smallest thing that actually solves the problem, with its own timeline, risks and price, not a maximal rebuild nobody asked for.",
  },
  {
    title: "Direct technical collaboration",
    description:
      "You work directly with the person building it. We'll name the lead once one is assigned; not every Fellow in the community is staffed on your project.",
  },
  {
    title: "Implementation & handover, not an afterthought",
    description:
      "Deployment, training, documentation and support are part of the work when they're part of the agreement, not something we figure out after launch.",
  },
  {
    title: "Security and privacy by default",
    description:
      "Access control and data minimization are part of how we build, not a checkbox at the end. If a requirement, like a specific compliance certification, is outside what we currently support, we'll say so plainly.",
  },
];

export const transparency = {
  canDo: [
    "Scoped software, data and AI projects with a clear deliverable",
    "Integration work between systems you already run",
    "AI-assisted features with a human-approval step built in",
    "Implementation, training and ongoing support where contracted",
  ],
  needsPartner: [
    "Specialized regulatory or compliance audits outside our current certifications",
    "Large-scale enterprise data-warehouse migrations",
    "Work requiring on-site staff in a location we don't currently operate in",
  ],
  notOffered: [
    "Fully autonomous AI systems with no human review on consequential decisions",
    "Guaranteed 24/7 uptime commitments without a contracted support agreement",
    "Any engagement that skips a scoping conversation first",
  ],
};

