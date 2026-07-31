# Promptbench

**A prompt engineering IDE — write, run, and compare AI prompts side by side, with real usage data to back every decision.**

🔗 **Live demo:** https://promptbench-dun.vercel.app
🔗 **Repo:** https://github.com/SoulKanishk/promptbench-

No login required — open the link and start using it immediately.

---

## The problem

Most people write prompts by trial and error in a chat window, with no
record of what worked, no way to compare approaches objectively, and no
visibility into cost or latency trade-offs. Prompt engineering is treated
like a scratchpad, not a discipline.

## The solution

Promptbench brings a software-engineering workflow to prompt writing:
version your prompts like files, test variants against each other with
real metrics, and see the data — not just a gut feeling — behind which
approach wins.

## What it does

| Feature | Why it matters |
|---|---|
| **Compare mode** | Run zero-shot, few-shot, and chain-of-thought variants of the same prompt against the same input, side by side — with latency and token cost for each |
| **IDE-style workspace** | File-tree of saved prompts, tabs, a command palette (⌘K), keyboard shortcuts — the same muscle memory as VS Code, applied to prompt writing |
| **Live metrics** | Every run reports latency and token usage, so "which prompt is better" becomes a measurable answer, not an opinion |
| **Cloud sync (optional)** | Sign in and your prompt library follows you across devices; work locally with zero setup otherwise |
| **Zero-friction demo** | No account needed to try it — three real sample prompts are pre-loaded |

## Who this is for

Anyone iterating on prompts at any scale — from someone tuning a chatbot's
system prompt to a team standardizing how their product uses LLMs and
needing to justify prompt choices with data.

## Built with

Next.js · TypeScript · Tailwind CSS · Supabase (auth + database) · Groq
API (fast, free LLM inference) · deployed on Vercel

## How this was built

This project was built with Claude as a hands-on development partner —
from initial architecture decisions through debugging and deployment. The
full process, including the prompts used and what was manually corrected
along the way, is documented in `PROMPTS_USED.md`.
