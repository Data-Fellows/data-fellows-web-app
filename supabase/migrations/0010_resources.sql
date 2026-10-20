-- Admin-manageable resources (stories, guides, lessons) -- replaces the
-- hardcoded src/constants/resources.ts so new entries no longer require a
-- code change. Mirrors the sessions table pattern from 0004_sessions.sql.
-- Run this once in the Supabase SQL Editor after 0001-0009.

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null check (category in ('Story', 'Guide', 'Lesson')),
  href text not null,
  image_url text,
  published_date date,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_by uuid references public.admins(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on public.resources (status, category);

alter table public.resources enable row level security;

-- Reuses the set_updated_at() and is_admin() functions from 0001_challenges.sql.
create trigger resources_set_updated_at
  before update on public.resources
  for each row
  execute function public.set_updated_at();

create policy "public can read published resources"
  on public.resources for select
  using (status = 'published');

create policy "admins have full access to resources"
  on public.resources for all
  using (public.is_admin())
  with check (public.is_admin());

-- Seed with the content that used to be hardcoded in
-- src/constants/resources.ts -- this migration ships in the same commit
-- that deletes that fallback and switches both public readers (the
-- /resources page and the homepage widget) to this table exclusively, so
-- without seeding here, running this migration would empty both of them
-- the moment it's applied, not just leave them waiting for an admin to
-- backfill content.
insert into public.resources (title, description, category, href, image_url, published_date, status)
values
  (
    'The truth about getting your first Power BI gig',
    'Mubar Dauda breaks down the scope docs, pricing, and mindset shifts that helped him secure paid BI work.',
    'Story',
    'https://mubardauda.com/index.php/the-truth-about-getting-your-first-power-bi-gig-that-nobody-talks-about/',
    '/images/mubar.jpg',
    '2025-11-07',
    'published'
  ),
  (
    'Detecting fraudulent transactions in real life',
    'Nafisa Idris shares a step-by-step walkthrough for designing and evaluating an advanced fraud detection workflow.',
    'Story',
    'https://medium.com/@nafisaidris413/detecting-fraudulent-transactions-a-guide-to-building-an-advanced-fraud-detection-system-9e7506af55a4',
    '/images/nafisa.jpg',
    '2025-02-19',
    'published'
  ),
  (
    'Navigating Opportunities in the Diaspora with Jessica Ayodele',
    'Highlights from Jessica''s community session on mapping relocation paths, transferable skills, and sponsorship asks.',
    'Guide',
    'https://x.com/datafellowsinfo/status/1949109088433938940?s=46',
    '/images/navigating.webp',
    '2025-08-22',
    'published'
  ),
  (
    'Stand out as a potential hire: CVs do''s and don''ts',
    'A practical tear-down on positioning your experience, quantifying wins, and presenting a readable CV.',
    'Guide',
    'https://youtu.be/jfPS1ifUQY0?si=6l50oxvuhp5fJiel',
    '/images/cv.jpg',
    '2025-07-05',
    'published'
  ),
  (
    'Practical ways small businesses can use data to grow',
    'Ikonik Magazine captures how we help founders turn lightweight dashboards into growth decisions.',
    'Lesson',
    'https://ikonikpress.com/practical-ways-small-businesses-can-use-data-to-grow/',
    '/images/first.jpg',
    '2025-03-01',
    'published'
  ),
  (
    'Avoiding common data mistakes',
    'Tobi Oladimeji''s guide on the pitfalls he sees when SMEs stand up their first analytics stack.',
    'Lesson',
    'https://ikonikpress.com/avoiding-common-data-mistakes-by-tobi-oladimeji-for-ikonik-magazine/',
    '/images/second.jpg',
    '2025-01-18',
    'published'
  ),
  (
    'Clarity is the new currency: what building Data Fellows and Inscend taught me',
    'Tobi Oladimeji on turning a childhood spent following his mum to the market into a global community and Inscend -- and why clarity, not more data, is what founders actually need.',
    'Lesson',
    'https://ikonikpress.com/beyond-data-how-tobi-oladimeji-is-redefining-the-human-side-of-innovation/',
    '/images/tobi-beyond-data.webp',
    '2025-11-23',
    'published'
  ),
  (
    'Why ecommerce brands lose revenue without realizing it -- and how decision intelligence fixes it',
    'Tobi Oladimeji shares how we use decision intelligence at Data Fellows to catch the hidden revenue leaks ecommerce brands often miss.',
    'Lesson',
    'https://medium.com/@pressikonik/why-ecommerce-brands-lose-revenue-without-realizing-it-and-how-decision-intelligence-fixes-it-c74924c6b121',
    '/images/ecommerce-decision-intelligence.webp',
    null,
    'published'
  );
