# Connecting Google Analytics

The site works fine without this -- it just means you have no visibility
into traffic. Nothing else on the site depends on it.

## 1. Create a GA4 property

[analytics.google.com](https://analytics.google.com) -> Admin -> Create
property, for `datafellowsai.com`. Under Data Streams, add a Web stream for
your domain and copy the **Measurement ID** (looks like `G-XXXXXXXXXX`).

## 2. Set the environment variable

Add this in Vercel (Project Settings -> Environment Variables) for both
Production and Preview, and in `.env.local` for local testing:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 3. Redeploy

Redeploy on Vercel so the new environment variable takes effect. The
tracking script only renders when this variable is set, so nothing changes
until you do this.

## 4. Verify

Visit the live site, then check GA4 -> Reports -> Realtime -- you should
see your own visit show up within a minute or two.
