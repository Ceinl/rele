"use client";

import { cn } from "@/lib/utils";

interface QuestionSidebarProps {
  questions: { id: number; question: string }[];
  activeId: number | null;
  onSelect: (id: number) => void;
}

export default function QuestionSidebar({
  questions,
  activeId,
  onSelect,
}: QuestionSidebarProps) {
  return (
    <aside className="w-64 shrink-0 border-r border-border bg-abyss/50 flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="font-display text-sm font-medium text-ash tracking-wide uppercase">
          Questions
        </h2>
        <p className="text-[11px] text-muted mt-0.5">
          {questions.length} card{questions.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => onSelect(q.id)}
            className={cn(
              "w-full text-left px-4 py-2.5 transition-all duration-150 group",
              activeId === q.id
                ? "bg-amber/8 border-l-2 border-l-amber"
                : "border-l-2 border-l-transparent hover:bg-elevated/50 hover:border-l-border-light"
            )}
          >
            <div className="flex items-start gap-2.5">
              <span
                className={cn(
                  "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-medium transition-colors",
                  activeId === q.id
                    ? "bg-amber/15 text-amber"
                    : "bg-elevated text-muted group-hover:text-ash"
                )}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  "text-sm leading-snug line-clamp-2 transition-colors",
                  activeId === q.id
                    ? "text-chalk"
                    : "text-muted group-hover:text-ash"
                )}
              >
                {q.question}
              </span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}