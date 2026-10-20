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
