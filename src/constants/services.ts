export type ServiceOffering = {
  key: string;
  name: string;
  buyerProblem: string;
  included: string[];
  excluded: string[];
  deliverables: string[];
  deliveryMode: string;
  // Real, honestly-labeled prior work that relates to this service family --
  // left empty where we don't have a documented precedent yet, rather than
  // stretching an unrelated project to fill the slot.
  relatedWork?: { name: string; stage: string; href: string }[];
};

export const services: ServiceOffering[] = [
  {
    key: "workflow",
    name: "Workflow Automation",
    buyerProblem:
      "A recurring process, like intake, approvals, or status updates, still runs on manual steps, spreadsheets, or email threads, and it costs your team real hours every week.",
    included: [
      "Mapping the process as it actually runs today, not as the org chart says it should",
      "Automating the repetitive steps, with a clear point where a person reviews and approves",
      "Handling the exceptions a fully manual process currently absorbs quietly",
    ],
    excluded: [
      "Reselling or licensing a no-code platform as the deliverable itself",
      "Open-ended process work outside an agreed scope without a new agreement",
    ],
    deliverables: [
      "A documented process map",
      "A working automated workflow",
      "A handover plan for your team",
    ],
    deliveryMode: "Scoped project or pilot",
  },
  {
    key: "integration",
    name: "Software & Systems Integration",
    buyerProblem:
      "An operational workflow still runs on a system that was never built to do what you're asking of it now, or depends on systems that don't talk to each other.",
    included: [
      "Custom software and internal tools designed around your actual workflow",
      "Integrations between systems you already use",
      "A working product, not just a prototype or a slide deck",
    ],
    excluded: [
      "Off-the-shelf SaaS configuration with no custom development",
      "Open-ended feature work outside an agreed scope without a new agreement",
    ],
    deliverables: [
      "A scoped, working system",
      "Source code and documentation",
      "A handover plan for your team",
    ],
    deliveryMode: "Scoped project or build-and-operate engagement",
    relatedWork: [
      { name: "BizPilot AI", stage: "Explored", href: "/work/bizpilot" },
    ],
  },
  {
    key: "data-ai",
    name: "Data & AI Automation",
    buyerProblem:
      "Your data lives across several systems, nobody fully trusts the reports built from it, and you want AI to help close that gap without losing a person's say over what changes.",
    included: [
      "Pipelines that connect your existing systems",
      "Dashboards and reports built around decisions you actually make",
      "AI-assisted workflows with a human-approval step before anything goes live",
      "An honest assessment of where AI is a good fit for your problem, and where it isn't",
    ],
    excluded: [
      "Enterprise data-warehouse migrations at a scale we haven't yet supported",
      "Compliance certifications we don't currently hold; we'll tell you plainly if a requirement is outside what we can support today",
      "Fully autonomous systems with no human review on consequential decisions",
    ],
    deliverables: [
      "A documented data model",
      "Working pipelines and reports",
      "A working automation or AI-assisted feature",
      "Clear documentation of what the system does and doesn't decide on its own",
    ],
    deliveryMode: "Scoped project or pilot",
    relatedWork: [
      { name: "Inscend", stage: "Explored", href: "/work/inscend" },
    ],
  },
  {
    key: "managed",
    name: "Managed Automation",
    buyerProblem:
      "A system, ours or someone else's, needs to actually stay running, get used, and get better over time.",
    included: [
      "Deployment and rollout support",
      "Training for your team",
      "Ongoing monitoring, maintenance and support where agreed",
    ],
    excluded: [
      "Guaranteed uptime commitments we haven't contracted for",
      "Support for systems we didn't build and haven't reviewed",
    ],
    deliverables: [
      "A rollout plan",
      "Training materials or sessions",
      "A support agreement with clear response expectations",
    ],
    deliveryMode: "Recurring support engagement",
  },
];

export const servicesFaq: { question: string; answer: string }[] = [
  {
    question: "Can you start from just an idea?",
    answer:
      "Yes, if there's a real operational problem behind it, even loosely defined. A discovery conversation is where we scope it together.",
  },
  {
    question: "Can you integrate with legacy software?",
    answer:
      "We've done integration work before. Tell us what you're working with and we'll tell you honestly whether it's a fit.",
  },
  {
    question: "Will you support the system after it ships?",
    answer:
      "Yes, where that's part of the agreement. We don't disappear after launch.",
  },
  {
    question: "How is our data handled?",
    answer:
      "We take access control and data minimization seriously on every engagement. We don't currently hold specific compliance certifications; if your organization requires one, tell us early and we'll be direct about whether we can meet it.",
  },
  {
    question: "Who owns the code and IP?",
    answer:
      "By default we aim for the work we build for you to stay yours. Exact IP terms are set per contract, since they vary by engagement.",
  },
  {
    question: "What does a first conversation look like?",
    answer:
      "A short call. You describe the problem, we ask questions, and we tell you plainly whether it's something we can help with.",
  },
];
