-- Fixes a real bug in the initial enquiries implementation (0012): the
-- public-facing API route uses the anon-key client, but 0012's RLS policy
-- only grants the public role INSERT on public.enquiries -- no SELECT, no
-- UPDATE. In practice that means:
--   * .insert({...}).select(...).single() in src/pages/api/contact can
--     never return the inserted row (PostgREST's "return=representation"
--     is itself a read, which RLS denies), so every real submission would
--     500 despite being written.
--   * The rate-limit count query (a SELECT) is silently denied and
--     fails open every time -- rate limiting never actually limits
--     anything.
--   * The post-send notification_status/acknowledgement_status UPDATE is
--     denied outright.
-- Run this once in the Supabase SQL Editor after 0001-0013, before relying
-- on /api/contact in production.
--
-- Fix: two SECURITY DEFINER functions scoped to exactly what the public
-- API route needs, callable via supabase.rpc(). This keeps the table's
-- RLS as tight as 0012 intended (no broad public SELECT/UPDATE grant, no
-- service-role key living in application code) while letting the one
-- legitimate server-side caller do its job.

create or replace function public.submit_enquiry(
  p_full_name text,
  p_work_email text,
  p_organization text,
  p_enquiry_type text,
  p_problem_description text,
  p_existing_systems text,
  p_timeframe text,
  p_heard_about text,
  p_ip_address text,
  p_rate_limit_window_minutes int default 15,
  p_rate_limit_max int default 5
)
returns table (id uuid, created_at timestamptz, rate_limited boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_recent_count int;
  v_new_id uuid;
  v_created_at timestamptz;
begin
  if p_ip_address is not null then
    select count(*) into v_recent_count
    from public.enquiries e
    where e.ip_address = p_ip_address
      and e.created_at >= now() - make_interval(mins => p_rate_limit_window_minutes);

    if v_recent_count >= p_rate_limit_max then
      return query select null::uuid, null::timestamptz, true;
      return;
    end if;
  end if;

  insert into public.enquiries (
    full_name, work_email, organization, enquiry_type, problem_description,
    existing_systems, timeframe, heard_about, ip_address
  )
  values (
    p_full_name, p_work_email, p_organization, p_enquiry_type, p_problem_description,
    p_existing_systems, p_timeframe, p_heard_about, p_ip_address
  )
  returning enquiries.id, enquiries.created_at into v_new_id, v_created_at;

  return query select v_new_id, v_created_at, false;
end;
$$;

-- Deliberately not GRANTed to PUBLIC -- only the two roles PostgREST
-- actually authenticates requests as.
grant execute on function public.submit_enquiry(
  text, text, text, text, text, text, text, text, text, int, int
) to anon, authenticated;

-- Narrow, by design: only the 4 notification/acknowledgement bookkeeping
-- columns can be written, identified by the enquiry's own id (which only
-- the visitor who just submitted it, and the server, ever see). This
-- can't be used to read or modify any other field. A caller that
-- somehow obtained another enquiry's id could overwrite its
-- notification bookkeeping, but not read or expose anything -- an
-- accepted, low-severity tradeoff for not requiring a service-role key
-- in application code, consistent with how every other public-write
-- table in this schema (check_ins, session_registrations) stays on the
-- anon key.
create or replace function public.update_enquiry_notification(
  p_id uuid,
  p_notification_status text default null,
  p_notification_error text default null,
  p_acknowledgement_status text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_notification_status is not null
    and p_notification_status not in ('pending', 'sent', 'failed') then
    raise exception 'invalid notification_status';
  end if;
  if p_acknowledgement_status is not null
    and p_acknowledgement_status not in ('pending', 'sent', 'failed', 'skipped') then
    raise exception 'invalid acknowledgement_status';
  end if;

  update public.enquiries
  set
    notification_status = coalesce(p_notification_status, notification_status),
    notification_error = case
      when p_notification_status is not null then p_notification_error
      else notification_error
    end,
    notification_attempted_at = case
      when p_notification_status is not null then now()
      else notification_attempted_at
    end,
    acknowledgement_status = coalesce(p_acknowledgement_status, acknowledgement_status)
  where id = p_id;
end;
$$;

grant execute on function public.update_enquiry_notification(
  uuid, text, text, text
) to anon, authenticated;
