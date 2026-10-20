-- Sessions need two registration pathways: send people to an external
-- sign-up form/link (the existing default), or collect registrants
-- directly in the app -- which then needs somewhere to land and something
-- for admins to export, mirroring the check_ins pattern from
-- 0001_challenges.sql. Run this once in the Supabase SQL Editor after
-- 0001-0008.

alter table public.sessions
  add column if not exists registration_mode text not null default 'external'
    check (registration_mode in ('external', 'internal'));

create table public.session_registrations (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  name text not null,
  email text not null,
  created_at timestamptz not null default now(),
  unique (session_id, email)
);

create index on public.session_registrations (session_id);

alter table public.session_registrations enable row level security;

-- No "public can read" policy at all -- unlike check_ins there's no public
-- Wall that needs to show registrant names, so registrant name/email stays
-- admin-only by default (RLS with no matching policy denies access).
create policy "public can insert registrations for published internal sessions"
  on public.session_registrations for insert
  with check (
    exists (
      select 1 from public.sessions s
      where s.id = session_id
        and s.status = 'published'
        and s.registration_mode = 'internal'
    )
  );

create policy "admins have full access to session_registrations"
  on public.session_registrations for all
  using (public.is_admin())
  with check (public.is_admin());
