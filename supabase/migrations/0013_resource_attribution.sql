-- Additive author-attribution and editorial-grouping metadata for the
-- resources table, so Insights can credit a piece's actual author and
-- original publisher instead of reading like unattributed Data Fellows
-- content. Existing Story/Guide/Lesson categories and all existing rows
-- are left exactly as they are -- nothing here renames or drops a column.
-- Run this once in the Supabase SQL Editor after 0001-0012.

alter table public.resources
  add column if not exists author_name text,
  -- Loosely matches a person's name in src/views/shared/team.ts (no FK --
  -- that table isn't in the database, it's a TypeScript constant) so the
  -- frontend can link a resource card to that person's About/People entry.
  -- Left null for resources with no matching team profile.
  add column if not exists author_people_slug text,
  -- e.g. "IKONIK Magazine", "Medium", "LinkedIn" -- null for anything
  -- original to datafellowsai.com.
  add column if not exists original_publisher text,
  -- Short editorial topic/tag shown on the card, e.g. "Business Data
  -- Strategy" -- intentionally a single free-text field, not a many-to-many
  -- tags table, since the brief asks for "editorial topic or tags" (singular
  -- framing) and the existing schema has no precedent for a join table.
  add column if not exists topic text,
  add column if not exists featured boolean not null default false,
  -- true for anything hosted elsewhere and summarized/linked here, false
  -- for original Data Fellows content. Defaults true because every
  -- existing seeded row already points to an external href (ikonikpress.com,
  -- medium.com, X, YouTube) -- there is no original on-site article today.
  add column if not exists is_external_article boolean not null default true,
  -- One of the three editorial areas from the brief. Nullable -- existing
  -- rows aren't force-sorted into a track until an admin reviews and sets
  -- one; the public page groups untracked rows into their own "More from
  -- the community" section rather than hiding them.
  add column if not exists editorial_track text
    check (editorial_track is null or editorial_track in (
      'Business Insights',
      'Engineering Notes',
      'Research & Community'
    ));

create index if not exists resources_editorial_track_idx
  on public.resources (editorial_track) where editorial_track is not null;

-- Two already-published rows carry the wrong published_date -- verified
-- directly against the live articles (both on ikonikpress.com) while
-- researching the brief's article candidates. Corrected here rather than
-- silently: both titles/hrefs are unchanged, only the date and the new
-- attribution columns are set.
update public.resources
set
  published_date = '2025-10-22',
  author_name = 'Tobi Oladimeji',
  author_people_slug = 'tobi-oladimeji',
  original_publisher = 'IKONIK Magazine',
  topic = 'Data Quality & Business Operations',
  editorial_track = 'Business Insights'
where href = 'https://ikonikpress.com/avoiding-common-data-mistakes-by-tobi-oladimeji-for-ikonik-magazine/';

update public.resources
set
  published_date = '2025-06-30',
  author_name = 'Tobi Oladimeji',
  author_people_slug = 'tobi-oladimeji',
  original_publisher = 'IKONIK Magazine',
  topic = 'Business Analytics',
  editorial_track = 'Business Insights'
where href = 'https://ikonikpress.com/practical-ways-small-businesses-can-use-data-to-grow/';

-- Backfill attribution on the other two existing Tobi/IKONIK pieces that
-- were already correct -- verified unaffected by the date issue above, just
-- missing the new columns.
update public.resources
set
  author_name = 'Tobi Oladimeji',
  author_people_slug = 'tobi-oladimeji',
  original_publisher = 'IKONIK Magazine',
  editorial_track = 'Business Insights'
where href = 'https://ikonikpress.com/beyond-data-how-tobi-oladimeji-is-redefining-the-human-side-of-innovation/';

update public.resources
set
  author_name = 'Tobi Oladimeji',
  author_people_slug = 'tobi-oladimeji',
  original_publisher = 'Medium',
  editorial_track = 'Business Insights'
where href = 'https://medium.com/@pressikonik/why-ecommerce-brands-lose-revenue-without-realizing-it-and-how-decision-intelligence-fixes-it-c74924c6b121';

-- New verified article -- checked directly against the live page
-- (title, byline and November 11, 2026 publish date all confirmed) before
-- being added here.
insert into public.resources (title, description, category, href, published_date, status, author_name, author_people_slug, original_publisher, topic, editorial_track, is_external_article)
values (
  'Building a Lean and Affordable Data Strategy',
  'Tobi Oladimeji on starting with a clear goal and tracking the information a business already has, rather than reaching for expensive tooling first.',
  'Lesson',
  'https://ikonikpress.com/building-a-lean-and-affordable-data-strategy/',
  '2026-11-11',
  'published',
  'Tobi Oladimeji',
  'tobi-oladimeji',
  'IKONIK Magazine',
  'Business Data Strategy',
  'Business Insights',
  true
);
