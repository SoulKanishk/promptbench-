"use client";

import { Plus, FileText, Folder } from "lucide-react";
import { Prompt } from "@/lib/prompts";

export default function Sidebar({
  prompts,
  activeId,
  onSelect,
  onNew,
}: {
  prompts: Prompt[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  const folders = Array.from(new Set(prompts.map((p) => p.folder)));

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-ink-line bg-ink-raised">
      <div className="flex items-center justify-between border-b border-ink-line px-4 py-3">
        <span className="font-mono text-xs uppercase tracking-widest text-paper-dim">
          Prompts
        </span>
        <button
          onClick={onNew}
          aria-label="New prompt"
          className="rounded p-1 text-paper-dim transition hover:bg-ink hover:text-amber"
        >
          <Plus size={15} />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {folders.map((folder) => (
          <div key={folder} className="mb-1">
            <div className="flex items-center gap-1.5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-wide text-paper-dim/70">
              <Folder size={12} />
              {folder}
            </div>
            {prompts
              .filter((p) => p.folder === folder)
              .map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelect(p.id)}
                  className={`flex w-full items-center gap-2 py-1.5 pl-8 pr-4 text-left font-mono text-[13px] transition ${
                    p.id === activeId
                      ? "bg-ink text-amber"
                      : "text-paper/80 hover:bg-ink/60 hover:text-paper"
                  }`}
                >
                  <FileText size={13} className="shrink-0 opacity-60" />
                  <span className="truncate">{p.title}</span>
                </button>
              ))}
          </div>
        ))}
      </nav>
      <a
        href="/health"
        className="border-t border-ink-line px-4 py-2.5 font-mono text-[11px] text-paper-dim transition hover:text-amber"
      >
        /health →
      </a>
    </aside>
  );
}
