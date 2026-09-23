-- Real file upload for challenge/session banner images (replacing the
-- "paste a URL" field) -- a public Supabase Storage bucket that admins can
-- upload to directly from the admin forms, RLS-gated the same way as
-- every other admin-writable table.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'activity-images',
  'activity-images',
  true,
  5242880, -- 5MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "public can read activity images"
  on storage.objects for select
  using (bucket_id = 'activity-images');

create policy "admins can upload activity images"
  on storage.objects for insert
  with check (
    bucket_id = 'activity-images'
    and exists (select 1 from public.admins a where a.id = auth.uid())
  );

create policy "admins can update activity images"
  on storage.objects for update
  using (
    bucket_id = 'activity-images'
    and exists (select 1 from public.admins a where a.id = auth.uid())
  );

create policy "admins can delete activity images"
  on storage.objects for delete
  using (
    bucket_id = 'activity-images'
    and exists (select 1 from public.admins a where a.id = auth.uid())
  );
