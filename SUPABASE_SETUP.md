# Connecting the Challenge Tracker to Supabase

The site works fine without this -- `/activities` and any `/activities/challenges/*`
pages just show an empty/"coming soon" state until you complete these steps.
Nothing else on the site depends on Supabase.

## 1. Create a Supabase project

Create a free project at [supabase.com](https://supabase.com). Note the
**Project URL** and the **anon/public API key** (Project Settings → API).

## 2. Run the schema migrations

Open the Supabase SQL Editor and run every file in `supabase/migrations/`,
**in order** (`0001_challenges.sql`, then `0002_challenge_partner.sql`, then
`0003_security_fixes.sql`, and so on as new ones are added). Skipping one or
running them out of order can break the app -- for example, code that reads
a column a later migration adds will fail until that migration runs, and
0003 tightens security on tables 0001 creates.

## 3. Automate future migrations (recommended, one-time setup)

Every migration up to this point had to be pasted into the SQL Editor by
hand. Two GitHub Actions workflows remove that step going forward:

- **`.github/workflows/supabase-migrations.yml`** -- runs automatically on
  every push to `main` that touches `supabase/migrations/`. It only
  applies files the database hasn't seen yet, so it's safe to run every
  time; it does nothing if there's nothing new.
- **`.github/workflows/supabase-migration-repair.yml`** -- a manual tool
  (Actions tab → select it → "Run workflow") for marking a migration as
  already applied without running it. You need this **once**, right now,
  because migrations 0001-0005 were already run by hand before this
  pipeline existed -- without telling the auto-deploy workflow that,
  it would try to `create table` for tables that already exist and fail.

Setup:

1. Get a Supabase **personal access token**: [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) → Generate new token.
2. Get your project's **database password** -- the one set when the project was created. If you don't have it, reset it: Project Settings → Database → Reset database password.
3. Add both as **GitHub repository secrets**: repo → Settings → Secrets and variables → Actions → New repository secret:
   - `SUPABASE_ACCESS_TOKEN`
   - `SUPABASE_DB_PASSWORD`
4. Run the one-time repair: Actions tab → **"Repair Supabase migration history"** → Run workflow → leave the default (`0001 0002 0003 0004 0005`) → Run. This should finish green with no errors.
5. From now on, any new file added to `supabase/migrations/` is applied automatically the moment it's merged to `main` -- no more pasting SQL into the dashboard.

## 4. Disable public sign-up

Supabase Dashboard → Authentication → Providers → Email → turn **off**
"Allow new users to sign up." Admin accounts are created manually (step 6),
never via public sign-up.

## 5. Set environment variables

Copy `.env.example` to `.env.local` and fill in the two values from step 1.
Also add them in Vercel (Project Settings → Environment Variables) for both
Production and Preview:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 6. Create the first admin

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

## 7. Allow the password reset redirect

Supabase only follows a password-reset link to pages you've allowed.
Dashboard → Authentication → URL Configuration → **Redirect URLs** → add:

```
https://datafellowsai.com/admin/reset-password
```

Without this, "Forgot password?" emails send fine but the link in them
redirects to Supabase's default Site URL instead of the reset-password
page, and the flow silently doesn't work.

## 8. Redeploy

Redeploy on Vercel so the new environment variables take effect.

## 9. Verify

- Visit `/activities` -- once a challenge is published, its card should
  appear there and link to `/activities/challenges/<slug>`.
- The challenge page's Home and Wall tabs should load real data.
- Visit `/admin/login`, sign in with the account from step 6, and confirm
  you land on `/admin/challenges`. From there you can create, edit, and
  delete challenges -- no SQL needed for day-to-day use.
- If you set up step 3, push a trivial change to a migration file (or
  re-run the "Deploy Supabase migrations" workflow manually) and confirm
  it goes green in the Actions tab.
