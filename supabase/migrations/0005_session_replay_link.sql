-- Sessions need a separate post-event link -- once a session's date has
-- passed, "See recap" should point at the replay/recording, not the
-- pre-event signup form still sitting in registration_url.
-- Run this once in the Supabase SQL Editor after 0001-0004.
alter table public.sessions
  add column if not exists replay_url text;
