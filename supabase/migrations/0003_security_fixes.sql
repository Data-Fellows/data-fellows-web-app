-- Fixes for issues flagged by automated review on the Challenge Tracker PRs.
-- Run this once in the Supabase SQL Editor after 0001 and 0002.

-- 1. The public "can read check_ins" policy controls row access, but the
--    anon role could still select every column directly via the REST API,
--    including member_email -- the API's own column projection doesn't
--    stop that. Revoke anon's blanket column access and re-grant only the
--    columns the Wall/tracker actually need to expose.
revoke select on public.check_ins from anon;
grant select (
  id,
  challenge_id,
  challenge_day_id,
  member_name,
  learning_note,
  completed,
  created_at
) on public.check_ins to anon;

-- 2. The insert policy checked that challenge_day_id belonged to *some*
--    published challenge, but never checked that the row's own
--    challenge_id column matched that day's actual challenge -- a caller
--    could pair challenge A's id with challenge B's day, corrupting A's
--    stats/wall with B's day metadata.
drop policy if exists "public can insert check_ins for published challenges" on public.check_ins;
create policy "public can insert check_ins for published challenges"
  on public.check_ins for insert
  with check (
    exists (
      select 1 from public.challenge_days d
      join public.challenges c on c.id = d.challenge_id
      where d.id = challenge_day_id
        and c.id = challenge_id
        and c.status = 'published'
    )
  );

-- 3. Counting distinct participants by fetching every check_ins row into
--    JS and de-duping client-side silently undercounts past Supabase's
--    default 1000-row API cap. Do the distinct count in the database
--    instead. security definer since anon's column grant above no longer
--    includes member_email directly.
create or replace function public.count_distinct_participants(p_challenge_id uuid)
returns integer
language sql
security definer
stable
as $$
  select count(distinct member_email)::int
  from public.check_ins
  where challenge_id = p_challenge_id;
$$;

grant execute on function public.count_distinct_participants(uuid) to anon, authenticated;
