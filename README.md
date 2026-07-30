# Promptbench — a prompt IDE

Write, run, and compare prompts side by side. Zero-shot, few-shot, and
chain-of-thought variants go head-to-head on the same model, live — scored
on latency and token usage — powered by the free Groq API.

## Stack
- **Next.js 15 (App Router)** — Server Components by default; the workspace
  is a Client Component only where it needs interactivity (editing, running).
- **Tailwind CSS v4** — design tokens in `app/globals.css`.
- **Supabase** — optional. The app runs fully on `localStorage` out of the
  box (zero-friction demo, no login wall). If you set the two env vars in
  `.env.example` and run `supabase/schema.sql`, prompts/runs can sync to
  Supabase instead.
- **Groq API** — the user pastes their own free key (from
  console.groq.com/keys) in the top bar. It's sent directly from the
  browser to Groq and never touches our server or gets stored remotely.
- **Vercel** — zero-config deploy target.

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000, paste a free Groq key in the top bar, and run
one of the three sample prompts (sentiment classifier, summarizer, prompt
rewriter) in Run mode or Compare mode.

## Deploy to Vercel
```bash
npx vercel
```
No environment variables are required for the demo to work. If you want
optional Supabase persistence, add `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` in the Vercel project settings and run
`supabase/schema.sql` in your Supabase SQL editor first.

## Routes
- `/` — the IDE workspace (sidebar file-tree, editor, run/compare panel)
- `/health` — server-rendered health check; reports app status and, if
  configured, live Supabase connectivity

## Notes for reviewers
- `PROMPTS_USED.md` logs the prompts used to build this with AI assistance,
  plus what was manually corrected afterward, per the assignment brief.
