# Study Pro — The Nigerian Study App (Primary 1 → SS3)

[![CI](https://github.com/merebari7-web/study-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/merebari7-web/study-pro/actions)
[![Deploy on Netlify](https://img.shields.io/badge/Netlify-ready-00C7B7?logo=netlify&logoColor=white)](#-deploy-on-netlify-5-minutes)
[![License: MIT](https://img.shields.io/badge/License-MIT-f2b33d.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle%20ORM-336791?logo=postgresql&logoColor=white)](https://orm.drizzle.team)

Full NERDC & WAEC curriculum platform: lesson notes, quizzes, past questions, CBT simulator, flashcards, study tools, XP & streaks, PWA offline support.

**Stack:** Next.js 16 (App Router) · Tailwind CSS 4 · Drizzle ORM · PostgreSQL · Framer Motion · Netlify-ready.

---

## 🚀 Deploy on Netlify (5 minutes)

### Step 1 — Push this project to GitHub

```bash
git init
git add .
git commit -m "Study Pro"
git branch -M main
git remote add origin https://github.com/merebari7-web/study-pro.git
git push -u origin main
```

> The included `.gitignore` keeps `.env` and `node_modules` out of the repo.

### Step 2 — Create the site on Netlify

1. Log in to [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**.
2. Pick your GitHub repo. Netlify auto-detects **Next.js** and picks up `netlify.toml`
   (build command `npm run build`, Node 20, `@netlify/plugin-nextjs` runtime — already configured).
3. Click **Deploy site**. The first build succeeds immediately because every page renders
   on-demand (no build-time database dependency).

### Step 3 — Add a database (free, one click)

**Option A — Neon via Netlify (recommended):**

1. In your site's Netlify dashboard → **Extensions / Integrations → Neon Postgres** → install.
2. Create a database; the integration injects **`DATABASE_URL` / `NETLIFY_DATABASE_URL`**
   into your site environment — the app reads both automatically.

**Option B — Any Postgres (Neon/Supabase/Railway):**

1. Copy the connection string, e.g.
   `postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require`
2. Netlify → **Site configuration → Environment variables** → add `DATABASE_URL`.
   SSL is enabled automatically for non-localhost URLs.

### Step 4 — Create tables & seed the curriculum (one click)

Once the site is deployed and `DATABASE_URL` is set:

1. Netlify → **Environment variables** → add `BOOTSTRAP_SECRET` = any secret you choose (e.g. `mySecret123`).
2. Trigger a **redeploy** (so the env var is available).
3. Visit in your browser:

```
https://YOUR-SITE.netlify.app/api/bootstrap?secret=mySecret123
```

You should see `{"ok":true,"action":"seeded","stats":{"topics":515,...}}` — done! 🎉

The route creates all tables (idempotent) and seeds 54 subject streams, 515 topics across
3 terms, 1,399 class-focus notes and 124 questions. Re-running with the secret reseeds from scratch.

**Alternative (from your laptop):**

```bash
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require" npx drizzle-kit push
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require" npx tsx scripts/seed.ts
```

### Step 5 — Custom domain (optional)

Netlify → **Domain management → Add a domain** and follow the DNS prompts. Free HTTPS is automatic.

---

## 🔧 Environment variables

| Variable | Where used | Required |
|---|---|---|
| `DATABASE_URL` | DB connection (local dev & Netlify) | ✅ |
| `NETLIFY_DATABASE_URL` | Auto-injected by Netlify's Neon integration (fallback) | — |
| `BOOTSTRAP_SECRET` | Protects `/api/bootstrap` reseeding | Recommended |

## 💻 Local development

```bash
npm install
# .env → DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
npx drizzle-kit push      # create tables
npx tsx scripts/seed.ts   # seed curriculum
npm run dev
```

## 📝 Content batches

Hand-written lesson batches live in `src/data/rich/`.

- ✅ Batch 01 — Primary 1 Mathematics (`p1-mathematics.ts`)

To add another, create `src/data/rich/<batch>.ts` following the `RichBatch` type, register it in
`src/data/rich/index.ts`, then re-run the seed (locally or via `/api/bootstrap?secret=…`).
