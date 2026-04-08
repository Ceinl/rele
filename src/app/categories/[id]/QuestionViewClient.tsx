"use client";

import { useState } from "react";
import FlipCard from "@/components/FlipCard";
import Markdown from "@/components/Markdown";
import { ArrowLeft, ArrowRight, Layers, BookOpen, Menu, X } from "lucide-react";
import Link from "next/link";

type ViewMode = "cards" | "learn";

interface Question {
  id: number;
  question: string;
  answer: string;
  longAnswer: string | null;
}

interface CardsViewProps {
  category: { id: number; name: string; description: string | null };
  questions: Question[];
  initialMode?: ViewMode;
}

export default function CardsView({
  category,
  questions,
  initialMode = "cards",
}: CardsViewProps) {
  const [mode, setMode] = useState<ViewMode>(initialMode);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentQuestion = questions[activeIndex];

  const goNext = () => {
    setActiveIndex((i) => Math.min(i + 1, questions.length - 1));
  };
  const goPrev = () => {
    setActiveIndex((i) => Math.max(i - 1, 0));
  };

  if (questions.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="flex flex-col items-center text-center animate-fade-in">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-elevated">
            <Layers className="h-8 w-8 text-muted" strokeWidth={1.5} />
          </div>
          <h2 className="font-display text-xl text-ash">No cards yet</h2>
          <p className="mt-1 text-sm text-muted">
            This category doesn&apos;t have any questions
          </p>
        </div>
      </main>
    );
  }

  const displayAnswer = currentQuestion.longAnswer || currentQuestion.answer;

  return (
    <main className="flex-1 flex flex-col bg-void">
      {/* Toolbar */}
      <div className="border-b border-border bg-abyss/50 px-3 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link
            href="/categories"
            className="shrink-0 inline-flex items-center gap-1.5 text-xs text-muted hover:text-amber transition-colors"
          >
            <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
            <span className="hidden sm:inline">Categories</span>
          </Link>
          <div className="h-4 w-px bg-border shrink-0" />
          <h1 className="font-display text-sm sm:text-base font-medium text-chalk truncate">
            {category.name}
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {mode === "learn" && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-muted hover:text-chalk hover:bg-elevated transition-colors"
            >
              <Menu className="h-4 w-4" strokeWidth={1.5} />
            </button>
          )}

          <div className="flex items-center gap-1 bg-surface rounded-lg p-0.5">
            <button
              onClick={() => setMode("cards")}
              className={`flex items-center gap-1 sm:gap-1.5 rounded-md px-2 sm:px-3 py-1.5 text-xs font-medium transition-all ${
                mode === "cards"
                  ? "bg-card text-amber shadow-sm"
                  : "text-muted hover:text-ash"
              }`}
            >
              <Layers className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setMode("learn")}
              className={`flex items-center gap-1 sm:gap-1.5 rounded-md px-2 sm:px-3 py-1.5 text-xs font-medium transition-all ${
                mode === "learn"
                  ? "bg-card text-amber shadow-sm"
                  : "text-muted hover:text-ash"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="hidden sm:inline">Learn</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mode === "learn" && sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-abyss border-r border-border flex flex-col z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-[11px] text-muted">
                {questions.length} card{questions.length !== 1 ? "s" : ""}
              </p>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-lg text-muted hover:text-chalk hover:bg-elevated transition-colors"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-1">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setActiveIndex(i);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 transition-all duration-150 group ${
                    activeIndex === i
                      ? "bg-amber/8 border-l-2 border-l-amber"
                      : "border-l-2 border-l-transparent hover:bg-elevated/50 hover:border-l-border-light"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-medium transition-colors ${
                        activeIndex === i
                          ? "bg-amber/15 text-amber"
                          : "bg-elevated text-muted group-hover:text-ash"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`text-sm leading-snug line-clamp-2 transition-colors ${
                        activeIndex === i
                          ? "text-chalk"
                          : "text-muted group-hover:text-ash"
                      }`}
                    >
                      {q.question}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* Content */}
      {mode === "cards" ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
          <FlipCard
            question={currentQuestion.question}
            answer={currentQuestion.answer}
            index={activeIndex}
            key={currentQuestion.id}
          />
          <div className="flex items-center justify-between w-full max-w-2xl mt-6 sm:mt-8">
            <button
              onClick={goPrev}
              disabled={activeIndex === 0}
              className="btn-secondary gap-2 text-sm disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              <span className="hidden sm:inline">Previous</span>
            </button>
            <span className="text-sm text-muted tabular-nums">
              {activeIndex + 1}{" "}
              <span className="text-muted/50">of</span> {questions.length}
            </span>
            <button
              onClick={goNext}
              disabled={activeIndex === questions.length - 1}
              className="btn-secondary gap-2 text-sm disabled:opacity-30"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop sidebar */}
          <aside className="hidden md:flex w-72 shrink-0 border-r border-border bg-abyss/50 flex-col">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-[11px] text-muted">
                {questions.length} card{questions.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto py-1">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setActiveIndex(i)}
                  className={`w-full text-left px-4 py-2.5 transition-all duration-150 group ${
                    activeIndex === i
                      ? "bg-amber/8 border-l-2 border-l-amber"
                      : "border-l-2 border-l-transparent hover:bg-elevated/50 hover:border-l-border-light"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-medium transition-colors ${
                        activeIndex === i
                          ? "bg-amber/15 text-amber"
                          : "bg-elevated text-muted group-hover:text-ash"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`text-sm leading-snug line-clamp-2 transition-colors ${
                        activeIndex === i
                          ? "text-chalk"
                          : "text-muted group-hover:text-ash"
                      }`}
                    >
                      {q.question}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* Learn main area */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-xl animate-fade-in" key={currentQuestion.id}>
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sage/10 text-xs font-medium text-sage">
                  {activeIndex + 1}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-sage">
                  Answer
                </span>
              </div>
              <Markdown content={displayAnswer} />
            </div>

            <div className="flex items-center justify-between w-full mt-10 sm:mt-12">
              <button
                onClick={goPrev}
                disabled={activeIndex === 0}
                className="btn-secondary gap-2 text-sm disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                <span className="hidden sm:inline">Previous</span>
              </button>
              <button
                onClick={goNext}
                disabled={activeIndex === questions.length - 1}
                className="btn-secondary gap-2 text-sm disabled:opacity-30"
              >
                <span className="hidden sm:inline">Next</span>
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}