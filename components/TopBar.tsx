"use client";

import { Zap, KeyRound } from "lucide-react";
import { GROQ_MODELS } from "@/lib/groq";

export default function TopBar({
  mode,
  onModeChange,
  model,
  onModelChange,
  apiKey,
  onApiKeyChange,
}: {
  mode: "run" | "compare";
  onModeChange: (m: "run" | "compare") => void;
  model: string;
  onModelChange: (m: string) => void;
  apiKey: string;
  onApiKeyChange: (k: string) => void;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-ink-line bg-ink-raised px-4">
      <div className="flex items-center gap-3">
        <Zap size={16} className="text-amber" />
        <span className="font-mono text-sm font-semibold tracking-tight">
          Promptbench
        </span>
        <div className="ml-3 flex rounded-md border border-ink-line p-0.5 font-mono text-xs">
          {(["run", "compare"] as const).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`rounded px-2.5 py-1 capitalize transition ${
                mode === m
                  ? "bg-amber text-ink font-semibold"
                  : "text-paper-dim hover:text-paper"
              }`}
            >
              {m === "compare" ? "compare variants" : "run"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={model}
          onChange={(e) => onModelChange(e.target.value)}
          className="rounded-md border border-ink-line bg-ink px-2 py-1.5 font-mono text-xs text-paper outline-none focus:border-amber"
        >
          {GROQ_MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1.5 rounded-md border border-ink-line bg-ink px-2 py-1.5">
          <KeyRound size={13} className="text-paper-dim" />
          <input
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="gsk_ your Groq key"
            className="w-40 bg-transparent font-mono text-xs text-paper placeholder:text-paper-dim/60 outline-none"
          />
        </div>
        <a
          href="https://console.groq.com/keys"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[11px] text-amber hover:underline"
        >
          get free key ↗
        </a>
      </div>
    </header>
  );
}
