"use client";

import { useState } from "react";
import { Play, Loader2, Circle } from "lucide-react";
import { Prompt, RunResult, appendRun, uid, now } from "@/lib/prompts";
import { fillTemplate, runGroqPrompt } from "@/lib/groq";

export default function RunPanel({
  prompt,
  onUpdateContent,
  model,
  apiKey,
  history,
  onHistoryChange,
}: {
  prompt: Prompt;
  onUpdateContent: (content: string) => void;
  model: string;
  apiKey: string;
  history: RunResult[];
  onHistoryChange: (h: RunResult[]) => void;
}) {
  const [input, setInput] = useState(
    "The new update completely broke my workflow, and support still hasn't responded after three days."
  );
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);

  const handleRun = async () => {
    if (!apiKey) return;
    setRunning(true);
    const filled = fillTemplate(prompt.content, input);
    const r = await runGroqPrompt(apiKey, model, filled);
    const record: RunResult = {
      id: uid(),
      promptId: prompt.id,
      variantLabel: "single",
      model,
      input,
      output: r.output,
      latencyMs: r.latencyMs,
      tokens: r.tokens,
      error: r.error,
      createdAt: now(),
    };
    appendRun(record);
    onHistoryChange([record, ...history]);
    setResult(record);
    setRunning(false);
  };

  return (
    <div className="flex flex-1 gap-px overflow-hidden bg-ink-line">
      {/* Editor column */}
      <div className="flex w-1/2 flex-col bg-ink">
        <div className="border-b border-ink-line px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-paper-dim">
          {prompt.title}.prompt
        </div>
        <textarea
          value={prompt.content}
          onChange={(e) => onUpdateContent(e.target.value)}
          spellCheck={false}
          className="flex-1 resize-none bg-ink px-4 py-3 font-mono text-sm leading-relaxed text-paper outline-none"
        />
        <div className="border-t border-ink-line px-4 py-2">
          <label className="mb-1 block font-mono text-[11px] uppercase tracking-widest text-paper-dim">
            {"{{input}}"} value
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            className="w-full resize-none rounded border border-ink-line bg-ink-raised px-2.5 py-2 font-mono text-sm text-paper outline-none focus:border-amber"
          />
        </div>
        <button
          onClick={handleRun}
          disabled={running || !apiKey}
          className="m-4 flex items-center justify-center gap-2 rounded-md bg-amber py-2.5 font-mono text-sm font-semibold text-ink transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {running ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
          {apiKey ? "Run prompt" : "Add a Groq key to run"}
        </button>
      </div>

      {/* Output column */}
      <div className="flex w-1/2 flex-col bg-ink">
        <div className="border-b border-ink-line px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-paper-dim">
          Output
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {result ? (
            result.error ? (
              <p className="font-mono text-sm text-del">{result.error}</p>
            ) : (
              <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-paper">
                {result.output}
              </p>
            )
          ) : (
            <p className="font-mono text-sm text-paper-dim">
              Output will appear here after you run the prompt.
            </p>
          )}
        </div>
        {result && !result.error && (
          <div className="flex items-center gap-4 border-t border-ink-line px-4 py-2 font-mono text-[11px] text-paper-dim">
            <span>{result.latencyMs}ms</span>
            <span>{result.tokens} tokens</span>
            <span>{model}</span>
          </div>
        )}
        <div className="max-h-40 overflow-y-auto border-t border-ink-line px-4 py-2">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-paper-dim">
            History
          </p>
          {history.filter((h) => h.promptId === prompt.id).length === 0 && (
            <p className="font-mono text-[11px] text-paper-dim/60">No runs yet.</p>
          )}
          {history
            .filter((h) => h.promptId === prompt.id)
            .slice(0, 8)
            .map((h) => (
              <div
                key={h.id}
                className="flex items-center gap-2 py-0.5 font-mono text-[11px] text-paper-dim"
              >
                <Circle
                  size={7}
                  className={h.error ? "fill-del text-del" : "fill-add text-add"}
                />
                <span className="truncate">{h.output || h.error}</span>
                <span className="ml-auto shrink-0">{h.latencyMs}ms</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
