-- Optional per-challenge partner attribution, shown on the certificate as
-- "Issued by Data Fellows -- Powered by <partner_name>" when set.
-- Run this once in the Supabase SQL Editor after 0001_challenges.sql.
alter table public.challenges
  add column if not exists partner_name text;
