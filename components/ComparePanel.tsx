"use client";

import { useState } from "react";
import { Play, Loader2 } from "lucide-react";
import { Prompt, RunResult, appendRun, uid, now } from "@/lib/prompts";
import { fillTemplate, runGroqPrompt } from "@/lib/groq";

const ACCENTS = ["amber", "add", "del"] as const;

const ACCENT_CLASSES: Record<(typeof ACCENTS)[number], string> = {
  amber: "border-t-amber",
  add: "border-t-add",
  del: "border-t-del",
};

export default function ComparePanel({
  prompt,
  model,
  apiKey,
  onHistoryChange,
  history,
}: {
  prompt: Prompt;
  model: string;
  apiKey: string;
  history: RunResult[];
  onHistoryChange: (h: RunResult[]) => void;
}) {
  const [input, setInput] = useState(
    "The new update completely broke my workflow, and support still hasn't responded after three days."
  );
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Record<string, RunResult>>({});

  const handleRun = async () => {
    if (!apiKey) return;
    setRunning(true);
    const next: Record<string, RunResult> = {};
    await Promise.all(
      prompt.variants.map(async (v) => {
        const filled = fillTemplate(v.content, input);
        const r = await runGroqPrompt(apiKey, model, filled);
        const record: RunResult = {
          id: uid(),
          promptId: prompt.id,
          variantLabel: v.label,
          model,
          input,
          output: r.output,
          latencyMs: r.latencyMs,
          tokens: r.tokens,
          error: r.error,
          createdAt: now(),
        };
        appendRun(record);
        next[v.id] = record;
      })
    );
    onHistoryChange([...Object.values(next), ...history]);
    setResults(next);
    setRunning(false);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-ink-line px-4 py-3">
        <label className="mb-1 block font-mono text-[11px] uppercase tracking-widest text-paper-dim">
          Shared {"{{input}}"} — run against every variant below
        </label>
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={2}
            className="flex-1 resize-none rounded border border-ink-line bg-ink-raised px-2.5 py-2 font-mono text-sm text-paper outline-none focus:border-amber"
          />
          <button
            onClick={handleRun}
            disabled={running || !apiKey}
            className="flex shrink-0 items-center gap-2 rounded-md bg-amber px-4 font-mono text-sm font-semibold text-ink transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {running ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
            Compare
          </button>
        </div>
      </div>

      <div className="grid flex-1 gap-px overflow-hidden bg-ink-line" style={{ gridTemplateColumns: `repeat(${prompt.variants.length}, 1fr)` }}>
        {prompt.variants.map((v, i) => {
          const r = results[v.id];
          const accent = ACCENTS[i % ACCENTS.length];
          return (
            <div key={v.id} className={`flex flex-col overflow-hidden border-t-2 bg-ink ${ACCENT_CLASSES[accent]}`}>
              <div className="border-b border-ink-line px-3 py-2">
                <p className="font-mono text-xs font-semibold text-paper">{v.label}</p>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-2">
                {r ? (
                  r.error ? (
                    <p className="font-mono text-xs text-del">{r.error}</p>
                  ) : (
                    <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-paper">
                      {r.output}
                    </p>
                  )
                ) : (
                  <p className="font-mono text-xs text-paper-dim">Not run yet.</p>
                )}
              </div>
              {r && !r.error && (
                <div className="flex gap-3 border-t border-ink-line px-3 py-1.5 font-mono text-[10px] text-paper-dim">
                  <span>{r.latencyMs}ms</span>
                  <span>{r.tokens} tok</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
