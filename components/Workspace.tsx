"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import RunPanel from "./RunPanel";
import ComparePanel from "./ComparePanel";
import {
  Prompt,
  RunResult,
  loadPrompts,
  savePrompts,
  loadRuns,
  newPrompt,
} from "@/lib/prompts";
import { GROQ_MODELS } from "@/lib/groq";

export default function Workspace() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [mode, setMode] = useState<"run" | "compare">("run");
  const [model, setModel] = useState(GROQ_MODELS[0].id);
  const [apiKey, setApiKey] = useState("");
  const [history, setHistory] = useState<RunResult[]>([]);

  useEffect(() => {
    const loaded = loadPrompts();
    setPrompts(loaded);
    setActiveId(loaded[0]?.id ?? "");
    setHistory(loadRuns());
    const savedKey = window.localStorage.getItem("promptbench:groqkey");
    if (savedKey) setApiKey(savedKey);
  }, []);

  useEffect(() => {
    if (apiKey) window.localStorage.setItem("promptbench:groqkey", apiKey);
  }, [apiKey]);

  const active = prompts.find((p) => p.id === activeId) ?? prompts[0];

  const updateActiveContent = (content: string) => {
    const next = prompts.map((p) =>
      p.id === active.id ? { ...p, content, updatedAt: new Date().toISOString() } : p
    );
    setPrompts(next);
    savePrompts(next);
  };

  const handleNew = () => {
    const p = newPrompt(`untitled-${prompts.length + 1}`, "general");
    const next = [...prompts, p];
    setPrompts(next);
    savePrompts(next);
    setActiveId(p.id);
  };

  if (!active) return null;

  return (
    <div className="flex h-screen flex-col bg-ink">
      <TopBar
        mode={mode}
        onModeChange={setMode}
        model={model}
        onModelChange={setModel}
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          prompts={prompts}
          activeId={active.id}
          onSelect={setActiveId}
          onNew={handleNew}
        />
        {mode === "run" ? (
          <RunPanel
            prompt={active}
            onUpdateContent={updateActiveContent}
            model={model}
            apiKey={apiKey}
            history={history}
            onHistoryChange={setHistory}
          />
        ) : (
          <ComparePanel
            prompt={active}
            model={model}
            apiKey={apiKey}
            history={history}
            onHistoryChange={setHistory}
          />
        )}
      </div>
    </div>
  );
}
