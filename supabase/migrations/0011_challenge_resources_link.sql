-- A second, optional link on challenges for pointing people at supporting
-- material (a doc, a Slack channel, a recap) alongside the existing Join
-- button. Mirrors the cta_join_label/cta_join_href pair added in
-- 0001_challenges.sql. Run this once in the Supabase SQL Editor after
-- 0001-0010.

alter table public.challenges
  add column if not exists cta_resources_label text,
  add column if not exists cta_resources_href text;
