-- Supersedes the challenge-level cta_resources_label/cta_resources_href
-- columns from the previous version of this migration: the additional
-- resources link was meant to be per day (alongside each day's existing
-- lesson_url), not one link for the whole challenge. Drop the
-- challenge-level columns (added and immediately found to be the wrong
-- shape -- nothing reads or writes them yet) and add the per-day column
-- instead. Run this once in the Supabase SQL Editor after 0001-0010.

alter table public.challenges
  drop column if exists cta_resources_label,
  drop column if exists cta_resources_href;

alter table public.challenge_days
  add column if not exists resources_url text;
