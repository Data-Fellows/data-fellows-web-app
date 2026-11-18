// Individual engineering projects -- independent work, open-source tools and
// professional experience from across the team, kept separate from
// `products.ts` (Data Fellows' own product explorations: BizPilot AI,
// Inscend). Both power the same /work/[slug] case-study route; see
// src/pages/work/[slug].tsx. Keeping these as two typed arrays rather than
// merging them avoids disturbing the already-approved Product model and its
// existing case-study template while this richer shape is new.
//
// Every entry here was verified against its public source (README, commit
// history, fork status) before being added -- see the engineering-portfolio
// audit for what was checked and what was excluded. Nothing here claims a
// client, employer or commercial outcome beyond what the source documents.

export type Capability =
  | "Software engineering"
  | "Data engineering"
  | "Applied AI"
  | "Workflow automation"
  | "Business intelligence"
  | "Systems integration";

export type ProjectOrigin =
  | "Individual professional experience"
  | "Independent project"
  | "Open-source contribution"
  | "Research and experiment";

export type Contributor = {
  name: string;
  role: string;
  // Links back to /people when the contributor is on the current team.
  teamSlug?: string;
};

export type SourceLink = {
  label: string;
  href: string;
};

export type PortfolioProject = {
  id: string;
  slug: string;
  name: string;
  headline: string;
  summary: string;
  capabilities: Capability[];
  projectOrigin: ProjectOrigin;
  projectStatus: string;
  timePeriod: string;
  contributors: Contributor[];
  // Set only where a relationship to an organization is confirmed and safe
  // to publish -- leave both undefined rather than guess.
  organization?: string;
  organizationRelationship?: string;
  problem: string;
  approach: string;
  implementedFeatures: string[];
  plannedFeatures?: string[];
  engineeringDecisions?: { title: string; description: string }[];
  verifiedResults: string;
  technologies: string[];
  gallery?: { image: string; caption: string }[];
  sourceLinks: SourceLink[];
  attribution: string;
  upstreamProjects?: SourceLink[];
  homepageFeatured?: boolean;
  relatedProjects?: string[];
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "ont-communities",
    slug: "ont-communities",
    name: "Ontario Infrastructure Decision Intelligence Platform",
    headline: "Making public infrastructure data useful for decision-making",
    summary:
      "An independent data engineering and analytics platform that transforms Ontario's public infrastructure disclosures into validated, structured and accessible information.",
    capabilities: ["Data engineering", "Business intelligence", "Software engineering"],
    projectOrigin: "Independent project",
    projectStatus: "Active development",
    timePeriod: "2024 (group project) — 2026 (independent rebuild)",
    contributors: [{ name: "Tobi Oladimeji", role: "Independent rebuild, 2026", teamSlug: "tobi-oladimeji" }],
    problem:
      "Ontario publishes its infrastructure project disclosures publicly, but the raw data is hard to actually use: budgets are missing on a large share of records, completion dates are often imprecise, and there's no structured way to ask real questions of it, like which project types are furthest behind or where funding information is simply absent.",
    approach:
      "An automated pipeline ingests disclosures from Ontario's public CKAN data API, processes them in Python, and loads them into a five-table dimensional model in PostgreSQL. A FastAPI service exposes read-only analytical endpoints over that model, and a React/TypeScript frontend with an interactive Leaflet map lets someone explore projects by location, type and status rather than scrolling a spreadsheet.",
    implementedFeatures: [
      "Automated ingestion from Ontario's public CKAN API",
      "Five-table PostgreSQL dimensional schema",
      "Eight automated data-quality checks run against every ingest",
      "FastAPI analytical endpoints",
      "Interactive React/TypeScript + Leaflet map and dashboard",
    ],
    engineeringDecisions: [
      {
        title: "Missing data stays visible, not hidden",
        description:
          "About 47% of projects report a literal $0 budget in the source data. Rather than treating that as a real value or silently dropping it, it's flagged with an explicit budget_undisclosed indicator so analysis can't mistake \"not reported\" for \"free.\"",
      },
      {
        title: "Imprecise dates modeled honestly",
        description:
          "Roughly 96% of completion dates in the source lack day-level precision. Instead of forcing them into a plain DATE column (which would fabricate a precision the data doesn't have), each date carries a precision field alongside an upper-bound value.",
      },
      {
        title: "Validation catches real inconsistencies",
        description:
          "Automated checks caught at least one literally impossible date in the source disclosures (June 31st doesn't exist) — the kind of record that breaks naive date parsing silently rather than loudly.",
      },
    ],
    verifiedResults:
      "This is a self-initiated engineering project, not a client engagement, so there's no business outcome to report. What's verified directly from the repository: a working end-to-end pipeline against Ontario's public dataset, eight automated data-quality checks, and a documented audit of the data's real limitations rather than a polished but inaccurate picture of it.",
    technologies: ["Python", "PostgreSQL", "FastAPI", "React", "TypeScript", "Leaflet", "CKAN API"],
    sourceLinks: [{ label: "GitHub", href: "https://github.com/tobiolad/ont-communities" }],
    attribution:
      "The original 2024 analysis was a group project credited to Tobi Oladimeji, Sushma Gouri Deivanayagam, Sachin Suresh, Dwij Shyamsunder and Surya Amit Malwade. The 2026 rebuild — the version this case study describes — is Tobi's independent work, built using AI-assisted engineering tooling, on top of the data model and findings from that original project.",
    homepageFeatured: true,
    relatedProjects: ["inscend-source-agent", "xodocs"],
  },
  {
    id: "inscend-source-agent",
    slug: "inscend-source-agent",
    name: "Inscend Source Agent",
    headline: "Automating the search for prospective customers",
    summary:
      "An AI-assisted lead-discovery tool built to help find prospective beauty and skincare retailers for Inscend, Data Fellows' ecommerce intelligence product.",
    capabilities: ["Applied AI", "Business intelligence"],
    projectOrigin: "Independent project",
    projectStatus: "MVP",
    timePeriod: "2026",
    contributors: [{ name: "Tobi Oladimeji", role: "Builder", teamSlug: "tobi-oladimeji" }],
    organization: "Inscend",
    organizationRelationship:
      "Built independently by Tobi to support Inscend, Data Fellows' own product — not a commissioned or client engagement.",
    problem:
      "Finding prospective ecommerce brands to talk to for Inscend meant manually searching for and reading about retailers one at a time, with no structured way to compare candidates or capture why one might be a better fit than another.",
    approach:
      "A browser-only React app uses the Gemini API to search for and analyze beauty and skincare retailers across Canada and Nigeria. Each result comes back as a lead card with a signal-strength assessment, an initial fit guess, a discovery note and a suggested outreach angle, so a person can scan several candidates quickly rather than researching each one from scratch.",
    implementedFeatures: [
      "AI-assisted retailer discovery via the Gemini API",
      "Per-lead signal strength, fit assessment, discovery note and outreach angle",
      "Sample seed leads on first visit",
      "No backend — runs entirely client-side with the API key stored in the browser",
    ],
    plannedFeatures: [
      "A lead import form or CSV import — the README notes new leads currently require editing a source file directly",
    ],
    verifiedResults:
      "An MVP personal tool, not an enterprise lead-generation platform. No deployment or usage numbers are claimed here beyond what's documented: a working, deployed (Vercel) tool with no required environment configuration.",
    technologies: ["React", "Vite", "Gemini API"],
    sourceLinks: [{ label: "GitHub", href: "https://github.com/tobiolad/inscend-source-agent" }],
    attribution: "Built by Tobi Oladimeji.",
    relatedProjects: ["ont-communities"],
  },
  {
    id: "xodocs",
    slug: "xodocs",
    name: "Xodocs",
    headline: "Automating API documentation",
    summary:
      "An open-source tool that generates OpenAPI documentation for Express applications directly from the Zod schemas already used to validate requests.",
    capabilities: ["Software engineering", "Workflow automation"],
    projectOrigin: "Open-source contribution",
    projectStatus: "Shipped, MIT-licensed",
    timePeriod: "2025",
    contributors: [{ name: "Elijah Soladoye", role: "Author", teamSlug: "elijah-soladoye" }],
    problem:
      "Express API teams typically write and maintain OpenAPI/Swagger documentation by hand, separately from the validation schemas their code actually enforces. The two drift apart as endpoints change, and nobody notices until a consumer hits a mismatch.",
    approach:
      "Xodocs reads the Zod schemas and structured annotations (@route, @summary and similar tags) already present in an Express app's route handlers, and generates OpenAPI documentation from them directly — serving a Swagger UI at /docs and the raw spec as JSON.",
    implementedFeatures: [
      "OpenAPI generation from existing Zod schemas and route annotations",
      "Swagger UI served at /docs, raw spec at /docs/openapi.json",
      "Bearer and API-key auth scheme support",
      "@public tag to exclude specific routes from documentation",
    ],
    engineeringDecisions: [
      {
        title: "Documentation can't drift from validation",
        description:
          "Because the docs are generated from the same Zod schemas the API uses at runtime to validate requests, the documentation can't describe a shape the code doesn't actually enforce — the usual failure mode for hand-maintained API docs.",
      },
    ],
    verifiedResults:
      "A small, real open-source tool (MIT-licensed, public npm package) rather than a widely-adopted platform — there's no meaningful download or usage count to cite, so none is claimed here.",
    technologies: ["Node.js", "Express", "Zod", "OpenAPI", "TypeScript"],
    sourceLinks: [{ label: "GitHub", href: "https://github.com/shodown96/xodocs" }],
    attribution: "Built by Elijah Soladoye.",
    relatedProjects: ["ont-communities"],
    homepageFeatured: false,
  },
  {
    id: "hr-platform",
    slug: "hr-platform",
    name: "HR Platform",
    headline: "Building modular software for workforce operations",
    summary:
      "An independently developed HR platform exploring how employee management, payroll and access control can be organized into separate software services rather than one monolithic system.",
    capabilities: ["Software engineering", "Systems integration"],
    projectOrigin: "Independent project",
    projectStatus: "In progress — core services implemented, some modules still work in progress",
    timePeriod: "2026",
    contributors: [{ name: "Elijah Soladoye", role: "Author", teamSlug: "elijah-soladoye" }],
    problem:
      "Employee records, payroll and access permissions often end up spread across spreadsheets and HR software that wasn't built around how a specific organization actually works, with no clean way to extend or connect them to other internal tools.",
    approach:
      "A microservices architecture splits the platform into separate Auth, Employee and Payroll services, each with its own PostgreSQL database, communicating through a RabbitMQ event bus. Redis holds a shared permission cache so authorization checks don't need a round trip to the auth service on every request. A React admin frontend sits on top, and Docker Compose orchestrates the whole stack locally with seed and reset scripts.",
    implementedFeatures: [
      "Auth service: users, roles, permissions, JWT-based authentication",
      "Employee service: employees, departments, positions",
      "Payroll service: salaries, payroll records",
      "React admin frontend",
      "Docker Compose orchestration with seed/reset scripts",
    ],
    plannedFeatures: [
      "Time and attendance tracking (in progress)",
      "Audit logging (in progress)",
    ],
    engineeringDecisions: [
      {
        title: "A database per service",
        description:
          "Each service owns its own PostgreSQL database rather than sharing one schema, so services can change independently instead of coordinating every migration across the whole platform.",
      },
      {
        title: "Events over direct calls between services",
        description:
          "Services communicate through RabbitMQ rather than calling each other's APIs directly, so an employee-record change can trigger downstream payroll updates without the employee service needing to know payroll exists.",
      },
      {
        title: "A shared cache for authorization",
        description:
          "Permission checks read from a shared Redis cache instead of hitting the auth service on every request, keeping authorization fast without duplicating the permission model into every service.",
      },
    ],
    verifiedResults:
      "This is an independent engineering project, not a system in production use — it hasn't been deployed at an organization or handled real employee data. What's verified is the architecture itself: three working services with a real event-driven integration between them, not just a design document.",
    technologies: ["FastAPI", "PostgreSQL", "Redis", "RabbitMQ", "React", "Docker"],
    sourceLinks: [{ label: "GitHub", href: "https://github.com/shodown96/hr_platform" }],
    attribution: "Built by Elijah Soladoye.",
    homepageFeatured: true,
    relatedProjects: ["xodocs", "ont-communities"],
  },
  {
    id: "pi-ampersand",
    slug: "pi-ampersand",
    name: "Pi Ampersand",
    headline: "Integrating an AI collaborator into an existing workflow",
    summary:
      "An integration that lets a second AI collaborator observe an existing AI coding session and offer commentary, without taking control of it.",
    capabilities: ["Applied AI", "Systems integration"],
    projectOrigin: "Open-source contribution",
    projectStatus: "Shipped",
    timePeriod: "2026",
    contributors: [{ name: "Sami Ansari", role: "Author", teamSlug: "sami-ansari" }],
    problem:
      "Running two separate AI tools side by side usually means picking one: either a second assistant gets full control, or it's cut off from what's actually happening and can't contribute anything useful.",
    approach:
      "Pi Ampersand reads the user and assistant messages from an existing Pi session (each message clipped to a fixed length) and forwards them to a separate Ampersand session, which can respond with commentary surfaced back in the original conversation via a small set of commands. It's opt-in and off by default.",
    implementedFeatures: [
      "Message forwarding from a Pi session to an Ampersand session",
      "/amp, /amp on/off and /amp <text> commands",
      "Off by default — sends nothing without an explicit API key and opt-in",
    ],
    engineeringDecisions: [
      {
        title: "Observation only, by design",
        description:
          "The integration deliberately can't see tool calls, commands or file edits, and can't act on the session it's attached to — \"it can talk but can't act,\" as the project's own documentation puts it. That's a scope boundary chosen on purpose, not a missing feature.",
      },
    ],
    verifiedResults:
      "41 GitHub stars at time of review — a real, directly verifiable public engagement signal, not a business outcome. No commercial deployment or customer claim is made for this project.",
    technologies: ["Pi agent platform"],
    sourceLinks: [{ label: "GitHub", href: "https://github.com/y0usaf/pi-ampersand" }],
    attribution: "Built by Sami Ansari, on top of the earendil-works/pi session platform.",
    upstreamProjects: [{ label: "earendil-works/pi", href: "https://github.com/earendil-works/pi" }],
    relatedProjects: ["ont-communities"],
  },
];

export const getPortfolioProject = (slug: string) =>
  portfolioProjects.find((project) => project.slug === slug);
