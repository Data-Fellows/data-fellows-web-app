-- Public consulting/community enquiry submissions from the /contact page.
-- Replaces the mailto:-only form: visitors submit directly through the
-- website, the row is written here first (durable, admin-only), and an
-- email notification to info@datafellowsai.com is attempted afterward --
-- see src/pages/api/contact/index.ts. notification_status lets staff tell
-- "we received it" (this row exists) apart from "we were notified by
-- email" (notification_status = 'sent'), and retry failed notifications.
-- Run this once in the Supabase SQL Editor after 0001-0011.

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  work_email text not null,
  organization text,
  enquiry_type text not null check (enquiry_type in (
    'Discuss a business problem',
    'Data and analytics',
    'Workflow or AI automation',
    'Custom software and integrations',
    'Ongoing support',
    'Partnership',
    'Community or general enquiry'
  )),
  problem_description text not null,
  existing_systems text,
  timeframe text,
  heard_about text,
  -- Set from the request, never from client-supplied JSON -- used only for
  -- durable, cross-invocation rate limiting (see src/lib/api/rate-limit.ts)
  -- and abuse review. Not shown to the visitor, never returned by the API.
  ip_address text,
  notification_status text not null default 'pending'
    check (notification_status in ('pending', 'sent', 'failed')),
  notification_error text,
  notification_attempted_at timestamptz,
  acknowledgement_status text not null default 'pending'
    check (acknowledgement_status in ('pending', 'sent', 'failed', 'skipped')),
  hubspot_synced_at timestamptz,
  hubspot_contact_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on public.enquiries (created_at desc);
create index on public.enquiries (ip_address, created_at);
create index on public.enquiries (notification_status) where notification_status != 'sent';

alter table public.enquiries enable row level security;

-- Reuses the set_updated_at() and is_admin() functions from 0001_challenges.sql.
create trigger enquiries_set_updated_at
  before update on public.enquiries
  for each row
  execute function public.set_updated_at();

-- Public can INSERT only -- no select/update/delete policy for the public
-- role at all, so RLS denies every other access path by default. Visitors
-- can never read, enumerate, or edit enquiries (their own or anyone
-- else's) through the API; only the reference ID returned at submission
-- time identifies their own enquiry, and nothing in this schema lets that
-- ID be used to look the row back up publicly.
create policy "public can submit enquiries"
  on public.enquiries for insert
  with check (true);

create policy "admins have full access to enquiries"
  on public.enquiries for all
  using (public.is_admin())
  with check (public.is_admin());
