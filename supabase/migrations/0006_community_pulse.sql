-- Sitewide social-proof numbers for the "community pulse" banner on
-- /activities and the homepage. member_email isn't grantable to anon (see
-- 0003_security_fixes.sql), so a distinct-member count across all
-- challenges needs the same security definer pattern as
-- count_distinct_participants, just without the per-challenge filter.
create or replace function public.count_distinct_members()
returns integer
language sql
security definer
stable
as $$
  select count(distinct member_email)::int
  from public.check_ins;
$$;

grant execute on function public.count_distinct_members() to anon, authenticated;
