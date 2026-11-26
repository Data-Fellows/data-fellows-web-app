# Data Fellows community-led website transformation

## Scope and safety

- Working branch: `codex/community-led-transformation`.
- Source reviewed: current public site and the Pages Router application in this repository.
- No production database, production deployment, main branch, or operational CRM/outbound settings were changed.
- Existing route paths are retained. `/services` and `/approach` now explain technology development and community participation rather than commercial service packages.

## Audit findings

### Live public pages reviewed

Homepage, Community, Services, Work, Impact, Activities, About, and Partners were inspected on the live site. The live experience already had authentic community photography, member stories, a project archive, activities, an impact report/dashboard, and partner categories. Its main positioning mismatch was the automation studio and buyer journey across the hero, navigation, service/approach pages, partner benefits, contact/book routes, and footer.

The impact page on the live site displayed a different set of figures than the checked-in source and homepage. The live impact page showed 217+ community, 4+ countries, 5+ engagements, and 203+ scholarships; the repository's shared metric source lists 1,600+, 33+, 40+, and 1,500+ respectively. None of these underlying metric records were changed. The discrepancy needs an owner to reconcile against the 2026 impact report and dashboard before adjusting public impact data.

### Repository and systems reviewed

- Next.js 15 Pages Router, React 18, TypeScript, Tailwind CSS v4, Supabase, Framer Motion, and Vercel configuration.
- Public routes include home, about, activities, community, services, approach, work and dynamic project details, impact and report, partners, people, careers, resources, contact, book, privacy and terms.
- Admin pages and APIs support activities/challenges, sessions/registration, resources, check-ins and Supabase-backed content. Supabase authentication and storage are used in admin/member flows.
- Existing HubSpot contact form and meeting embeds, MailerLite signup, optional Google Analytics, community registration, activity/session forms, dynamic activity and resource routes, impact dashboard/report, and sitemap generation remain in place.
- Existing member data, database migrations, APIs, forms, auth, external integrations, environment configuration and dashboards were not edited.
- `next.config.ts` already has legacy route redirects. No route was retired in this update, so no new redirects were needed.

## Brand inventory retained

Values below are the current source tokens in `src/styles/globals.css`; this change did not replace the theme or logo.

| Token | Light theme | Dark theme |
| --- | --- | --- |
| Background | `hsl(210 33% 98%)` | `hsl(217 24% 11%)` |
| Foreground | `hsl(213 35% 14%)` | `hsl(210 30% 92%)` |
| Primary | `hsl(205 48% 26%)` | `hsl(205 55% 78%)` |
| Secondary | `hsl(165 63% 60%)` | `hsl(165 40% 16%)` |
| Accent | `hsl(188 65% 84%)` | `hsl(188 45% 25%)` |
| Brand blue | `hsl(204 78% 48%)` | `hsl(204 78% 48%)` |
| Brand blue button fill | `hsl(204 78% 38%)` | `hsl(204 78% 38%)` |
| Brand blue foreground | `hsl(0 0% 100%)` | `hsl(0 0% 100%)` |
| Fixed showcase surface | `hsl(30 8% 9%)` | `hsl(30 8% 9%)` |
| Showcase text | `hsl(43 25% 92%)` | `hsl(43 25% 92%)` |

Typography remains Inter (body), Space Grotesk (display), and IBM Plex Mono (eyebrows/labels), loaded by the existing Google Fonts import. Existing theme behavior and the existing SVG logo, community photographs, project images and branded assets are retained. The document theme-color metadata is aligned to the existing brand blue (`#1570ac`). No new palette or logo was introduced.

## Updated information architecture

Primary navigation: Home, Community, Programs (`/activities`), Projects (`/work`), Studio, Impact, About, Insights (`/resources`), plus Join the Community and Book a Session actions.

The Studio is a dedicated page and route. It explains the Studio's role within Data Fellows, shows team professional experience (including PwC, Cohere and Andela) with a clear note that these are individual professional backgrounds rather than Data Fellows clients or sponsors, and links to `https://studio.datafellowsai.com`. Session booking and the existing HubSpot contact form are retained as routes for organizations and collaborators.

Supporting routes remain available for Events/Activities, People, Partners, Contact, Careers, technical development principles, and legal information. The homepage now leads with community, then the five pillars, story, selected work, impact, partners, editorial resources, and a participation CTA.

The Community page describes who can join, ways to participate, and directs visitors to current activity status. The Activities page remains the source of truth for open, ongoing, upcoming, and past listings. Program cards are informational and do not promise a schedule or benefit.

## Messaging and content changes

- Hero: “Building technology through community.” with community participation and project archive calls to action.
- Added Community, Learning, Building, Collaboration, and Impact pillars.
- Updated about and community copy to reflect the August 2022 founding and global network.
- Updated Tobi Oladimeji's public title to “Product & Community Builder” and refreshed his bio using the supplied foundation. No other person's official title or responsibility was changed.
- Reframed `/services` as “Technology development” and `/approach` as community learning/building principles while retaining both URLs. Automation and integrations remain visible as documented project capabilities, without presenting “automation studio” as Data Fellows' organizational identity.
- Updated navigation, footer, homepage CTA, people, careers, contact, book, partner, activities and selected-work language to prioritize participation and collaboration. The header and footer keep both community joining and session booking visible.
- Historical Inscend and BizPilot AI records remain in the project archive and are labeled concluded/inactive explorations.
- Existing individual/member work remains distinguished from Data Fellows and collaborative work.

Removed from the homepage and general company narrative: service-package sales copy, a client procurement journey, the old automation-studio hero/footer position, and the homepage product carousel. The dedicated Studio page keeps a clear route for scoped technical engagement, booking, and contact, while the historical products and detailed archive remain accessible under Projects. Old, unreferenced service/approach constants and section source files remain in the repository for traceability; they are not used by the updated pages.

## Preserved history and infrastructure

Preserved: the project archive and case details, historical products, community member stories/photos, founding/contributor biographies, partner classifications, activities/event system, impact report/dashboard routes, editorial library and newsletter flow, join links, Supabase data/auth/API flows, HubSpot contact/meeting integration, MailerLite, optional analytics, sitemap, privacy/terms pages, and all legacy route paths.

The website makes no claim that community members are employees or an on-demand technical workforce. Possible partnership areas are presented as future collaboration possibilities, not current commitments. Existing commercial obligations and outbound activity were outside this website change and were not modified.

## SEO and public consistency

- Homepage page title and description updated to the community-led positioning.
- Shared organization description, founding date, sitewide Organization/WebSite JSON-LD, and document theme-color updated or aligned.
- Existing canonical, Open Graph, Twitter card, logo, sitemap and analytics mechanisms retained.
- Existing routes and canonical paths remain; no redirects were removed or added.

## Proposed team-title changes needing approval

None beyond Tobi's requested title change. The community page groups historical “Founding … Leads” contributors under a general contributors heading and describes their work in the past tense. Existing role labels and other contributor/advisor roles are preserved. Any title or role updates for other people should be approved separately.

## Verification status and outstanding items

Implementation is on the separate branch and has not been merged or deployed to production. The production build and TypeScript check pass for the Studio-page revision. The branch preview requires Vercel sign-in before browser QA and desktop/tablet/mobile screenshots can be completed. Lint, responsive, accessibility, forms/auth regression, link, metadata, performance and image checks remain outstanding.

Outstanding content review: reconcile the live impact-page metric values with the current source values and authoritative report/dashboard before changing metric data. Activity availability changes over time; the existing activity route/database remains the operational source. Confirm the existing community join destination and HubSpot/meeting routing in an authorized preview environment before launch; identifiers and endpoints were kept unchanged. No production changes were made.
