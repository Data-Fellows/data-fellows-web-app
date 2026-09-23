-- Lets admins attach a banner image to a challenge or session (e.g. the
-- flyer graphic already made for each Fireside speaker), so /activities
-- cards can show a real preview instead of text only.
alter table public.sessions add column if not exists image_url text;
alter table public.challenges add column if not exists image_url text;
