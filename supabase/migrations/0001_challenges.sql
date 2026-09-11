-- Data Fellows challenge tracker schema.
-- Run this once in the Supabase SQL Editor for a fresh project.
-- See SUPABASE_SETUP.md in the repo root for the full setup walkthrough.

create extension if not exists "pgcrypto";

-- Allowlist of who may act as staff/admin. Rows are inserted manually
-- (never via app code) after creating the matching auth.users account:
--   insert into public.admins (id, email, full_name)
--   values ('<uuid-from-auth-users>', 'name@datafellowsai.com', 'Full Name');
create table public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now()
);

create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  description text,
  start_date date not null,
  end_date date not null,
  daily_commitment text,
  member_target int,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  cta_join_label text default 'Join the Challenge',
  cta_join_href text,
  created_by uuid references public.admins(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.challenge_days (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  day_number int not null,
  title text not null,
  lesson_url text,
  summary text,
  unique (challenge_id, day_number)
);

create table public.check_ins (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  challenge_day_id uuid not null references public.challenge_days(id) on delete cascade,
  member_name text not null,
  member_email text not null,
  learning_note text,
  completed boolean not null default true,
  created_at timestamptz not null default now(),
  unique (challenge_day_id, member_email)
);

create index on public.check_ins (challenge_id);
create index on public.check_ins (member_email, challenge_id);
create index on public.challenge_days (challenge_id, day_number);

-- updated_at maintenance
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger challenges_set_updated_at
  before update on public.challenges
  for each row
  execute function public.set_updated_at();

-- Row Level Security
alter table public.admins enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_days enable row level security;
alter table public.check_ins enable row level security;

-- Shared predicate used by every admin policy below.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (select 1 from public.admins a where a.id = auth.uid());
$$;

-- admins: no public access at all; admins may read their own row.
create policy "admins can read own row"
  on public.admins for select
  using (id = auth.uid());

-- challenges: public can read published; admins have full access.
create policy "public can read published challenges"
  on public.challenges for select
  using (status = 'published');

create policy "admins have full access to challenges"
  on public.challenges for all
  using (public.is_admin())
  with check (public.is_admin());

-- challenge_days: public can read days of published challenges; admins have full access.
create policy "public can read days of published challenges"
  on public.challenge_days for select
  using (
    exists (
      select 1 from public.challenges c
      where c.id = challenge_id and c.status = 'published'
    )
  );

create policy "admins have full access to challenge_days"
  on public.challenge_days for all
  using (public.is_admin())
  with check (public.is_admin());

-- check_ins: public can read (needed for the Wall) and insert against a
-- published challenge's day; admins have full access (moderation).
create policy "public can read check_ins"
  on public.check_ins for select
  using (true);

create policy "public can insert check_ins for published challenges"
  on public.check_ins for insert
  with check (
    exists (
      select 1 from public.challenge_days d
      join public.challenges c on c.id = d.challenge_id
      where d.id = challenge_day_id and c.status = 'published'
    )
  );

create policy "admins have full access to check_ins"
  on public.check_ins for all
  using (public.is_admin())
  with check (public.is_admin());
