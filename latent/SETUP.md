# ITC Club Ratings — setup

## What's in this drop

```
app/
  page.tsx                    protected rating form (redirects to /login)
  login/page.tsx              SSO login screen
  components/LoginButton.js   redirects into SSO
  components/RatingForm.tsx   the 15-slider form + submit
  components/ClubSlider.tsx   single 0–10, 1-decimal slider
  api/auth/callback/route.ts  SSO callback -> upserts user, sets session cookie
  api/ratings/route.ts        POST -> upserts one rating per user per club
  itc-got-latent/page.tsx     unlisted analytics page (server component)
  itc-got-latent/GotLatentBoard.tsx  themed leaderboard UI
  itc-got-latent/got-latent.css      stage/curtain/buzzer animations
lib/
  clubs.ts     the 15 clubs (see note below)
  prisma.ts    Prisma client singleton
  session.ts   JWT session cookie sign/verify (jose)
  sso.ts       ITC SSO login URL + getuserdata fetch
  auth.ts      getCurrentUser() helper for server components/routes
middleware.ts  redirects "/" to "/login" if no session cookie
prisma/schema.prisma   User / Club / Rating models
prisma/seed.ts         seeds the 15 clubs
```

Drop these into your existing repo at the same paths (no `src/` dir — this
matches the `@/lib/...` and `@/app/...` import aliases already used in the
files you provided).

## Fixes made to the files you provided

- **`route.ts` (now `app/api/auth/callback/route.ts`)**: it redirected to a
  hardcoded `http://webteam-ls.tech-iitb.org/dashboard` instead of using the
  `baseUrl` it computed — that would break on any other domain (staging,
  Coolify preview, etc.) and downgrades to plain HTTP. Now redirects to `/`
  on `baseUrl`. It also set `secure: false` on the session cookie, which
  ships it over plain HTTP; now it's `secure: true` in production. It also
  called `prisma.submission.upsert(...)` — that model isn't part of this
  app's schema (looked like leftover from a different project), so it's
  removed.
- **`LoginButton.js`**: pointed at `http://sso.tech-iitb.org/...` (no `s`);
  the docs' own API reference uses `https://` throughout, so fixed to match.
- **Club count**: the brief says "13 clubs" but lists 15 names. All 15 named
  clubs are in `lib/clubs.ts` — trim it if 13 was actually intended.

## One-time setup

```bash
npm install jose                 # session JWT signing (only new dependency)
npx prisma migrate dev --name init
npx prisma db seed               # populate the 15 clubs
```

Add to `package.json` if not present:
```json
"prisma": { "seed": "ts-node prisma/seed.ts" }
```
(or `tsx prisma/seed.ts` if you use tsx instead of ts-node)

Copy `.env.example` to `.env` and fill in `DATABASE_URL` (from your Coolify
Postgres service), `NEXT_PUBLIC_PROJECT_ID` (from the SSO "My Projects"
dashboard), `SESSION_SECRET` (`openssl rand -base64 48`), and `APP_URL`.

In the SSO project dashboard, set the redirect URL to:
`{APP_URL}/api/auth/callback`

## Notes on the pieces you asked for

- **Slider precision**: the `<input type="range" step={0.1}>` already limits
  the UI to tenths; the API additionally rounds every incoming score to the
  nearest 0.1 server-side (`Math.round(score * 10) / 10`) before it's
  stored, so a rounding bug on some client can't sneak an 11-decimal float
  into the database.
- **"Submits after rating all clubs"**: the submit button stays disabled
  until every one of the 15 sliders has been moved at least once
  (`RatingForm.tsx` tracks a `touched` set). Re-rating updates your existing
  row per club (`@@unique([userId, clubId])`) rather than creating
  duplicates.
- **Auth gate**: `middleware.ts` bounces `/` to `/login` if there's no
  session cookie at all; `app/page.tsx` then does the real JWT verification
  server-side and bounces again if the cookie is present but invalid/expired
  — middleware alone isn't enough to trust the session.
- **"ITC GOT Latent"**: at `/itc-got-latent`, never linked from any nav.
  `metadata.robots` is set to noindex/nofollow so it won't show up in search
  either — but the URL itself gives no access control, so anyone with the
  link can view aggregate averages. That's what "public but unlisted" means
  here; if you actually want it gated, say so and I'll add an auth check.

## Deploying on Coolify

- Standard Next.js app; set the four env vars above in the Coolify app
  config, pointing `DATABASE_URL` at the existing Postgres service.
- Run `npx prisma migrate deploy && npx prisma db seed` as part of your
  deploy/start command (or a Coolify post-deploy hook) so the schema and
  clubs exist before the app receives traffic.
