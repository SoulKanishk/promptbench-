# AI-assisted development log

This app was built with Claude as a development assistant. Below is a
summary of how AI was used at each stage, in the order it happened.

## 1. Ideation & spec
Prompt: "like vscode can we [build] something for prompt ide?" followed by
clarifying answers about persistence (localStorage-first, optional
Supabase) and features (single-run + side-by-side comparison mode).

AI contribution: proposed the concept ("Promptbench"), the data model
(prompts/variants/runs), the route list, and the demo-first auth strategy
(no login wall, so a recruiter can open the link and use it immediately).

## 2. Scaffolding
Prompt: instruction to scaffold with Next.js App Router, Tailwind, and
Supabase, matching the assignment's requirement for Server Components by
default and Client Components only where interactive.

AI contribution: ran `create-next-app`, installed `@supabase/supabase-js`
and `lucide-react`, and split the app so `/health` is a Server Component
that fetches live data, while the editable workspace (`Workspace.tsx` and
children) is marked `"use client"` since it needs state and browser APIs
(localStorage, fetch to Groq).

## 3. Visual design
AI contribution: proposed a design system deliberately avoiding generic
"AI app" defaults (cream+terracotta, plain near-black+neon) — instead used
an ink-green IDE palette with an amber accent and diff-style green/red
used functionally (run status, comparison column accents), since the
product is literally an editor/IDE and a git-diff visual language fits the
prompt-versioning concept.

## 4. Core logic
AI contribution: wrote `lib/groq.ts` (client-side Groq chat completion
caller with latency/token tracking), `lib/prompts.ts` (localStorage-backed
prompt store with three realistic sample prompts), and the Run/Compare
panels.

## Manual review & corrections after generation
- Verified the CSS `@import` order (Google Fonts import had to precede the
  `@import "tailwindcss"` statement, otherwise the build emitted a
  postcss warning) — reordered and rebuilt to confirm it was clean.
- Ran `npx tsc --noEmit` and `npm run build` explicitly rather than trusting
  the first generation, to catch type errors before calling it done.
- Confirmed the Groq API key is never sent anywhere except
  `api.groq.com` directly from the browser — checked `lib/groq.ts` by hand
  to make sure no server route or logging captured it, since that was a
  hard requirement carried over from the reference screenshots.
- Chose `force-dynamic` on `/health` explicitly so the health check always
  reflects live status instead of being statically cached at build time.
