# Connecting the Challenge Tracker to Supabase

The site works fine without this -- `/activities` and any `/activities/challenges/*`
pages just show an empty/"coming soon" state until you complete these steps.
Nothing else on the site depends on Supabase.

## 1. Create a Supabase project

Create a free project at [supabase.com](https://supabase.com). Note the
**Project URL** and the **anon/public API key** (Project Settings → API).

## 2. Run the schema migration

Open the Supabase SQL Editor and run the contents of
`supabase/migrations/0001_challenges.sql`. This creates the `challenges`,
`challenge_days`, `check_ins`, and `admins` tables, plus Row Level Security
policies.

## 3. Disable public sign-up

Supabase Dashboard → Authentication → Providers → Email → turn **off**
"Allow new users to sign up." Admin accounts are created manually (step 5),
never via public sign-up.

## 4. Set environment variables

Copy `.env.example` to `.env.local` and fill in the two values from step 1.
Also add them in Vercel (Project Settings → Environment Variables) for both
Production and Preview:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 5. Create the first admin

To sign in at `/admin`, you need at least one admin account:

1. Supabase Dashboard → Authentication → Users → **Add user** (set an email
   + password). Copy the new user's UUID.
2. In the SQL Editor, run:
   ```sql
   insert into public.admins (id, email, full_name)
   values ('<uuid-from-step-1>', 'you@datafellowsai.com', 'Your Name');
   ```

Logging in via Supabase Auth alone is **not** enough -- without this row,
the app still won't treat the account as staff, and every `/api/admin/*`
request will be rejected even if you're signed in.

## 6. Redeploy

Redeploy on Vercel so the new environment variables take effect.

## 7. Verify

- Visit `/activities` -- once a challenge is published, its card should
  appear there and link to `/activities/challenges/<slug>`.
- The challenge page's Home and Wall tabs should load real data.
- Visit `/admin/login`, sign in with the account from step 5, and confirm
  you land on `/admin/challenges`. From there you can create, edit, and
  delete challenges -- no SQL needed for day-to-day use.
