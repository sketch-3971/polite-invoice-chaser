# Polite Invoice Chaser

Next.js App Router + TypeScript + Tailwind CSS + Supabase cookie auth (`@supabase/ssr`).

## Commands

Install [Node.js](https://nodejs.org/) (LTS) first if `node` / `npx` are not available.

```bash
cd polite-invoice-chaser
npm install
copy .env.example .env.local
npm run dev
```

On macOS/Linux, use `cp .env.example .env.local` instead of `copy`.

Paste your Supabase Project URL and publishable (anon) key into `.env.local`.

In the Supabase dashboard, add this Redirect URL:

`http://localhost:3000/auth/callback`

## Auth notes

- Browser client: `lib/supabase/client.ts`
- Server client: `lib/supabase/server.ts`
- Session refresh: `lib/supabase/middleware.ts` + root `middleware.ts`
- Login/signup: `/login` → `/dashboard`
- Protected route: `/dashboard`
- Draft email API stub: `POST /api/draft-email`
