-- Lightweight admin-managed "Sessions" content type -- for recurring
-- single-date events like Fireside Sessions, where each month's edition
-- just needs a title/speaker, date, and registration link, not the full
-- multi-day challenge/check-in/certificate machinery.
-- Run this once in the Supabase SQL Editor after 0001-0003.

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  session_date date not null,
  registration_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_by uuid references public.admins(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on public.sessions (status, session_date);

alter table public.sessions enable row level security;

-- Reuses the set_updated_at() and is_admin() functions from 0001_challenges.sql.
create trigger sessions_set_updated_at
  before update on public.sessions
  for each row
  execute function public.set_updated_at();

create policy "public can read published sessions"
  on public.sessions for select
  using (status = 'published');

create policy "admins have full access to sessions"
  on public.sessions for all
  using (public.is_admin())
  with check (public.is_admin());
