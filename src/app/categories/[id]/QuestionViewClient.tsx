"use client";

import { useState } from "react";
import FlipCard from "@/components/FlipCard";
import Markdown from "@/components/Markdown";
import { ArrowLeft, ArrowRight, Layers, BookOpen, Menu, X, Plus, Pencil, Trash2, Check, PanelLeftClose, PanelLeft } from "lucide-react";
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
  categoryId: number;
  userId: number;
  isAdmin: boolean;
}

export default function CardsView({
  category,
  questions: initialQuestions,
  categoryId,
  userId,
  isAdmin,
}: CardsViewProps) {
  const [mode, setMode] = useState<ViewMode>("cards");
  const [activeIndex, setActiveIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [questions, setQuestions] = useState(initialQuestions);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const currentQuestion = questions[activeIndex];

  const goNext = () => {
    setActiveIndex((i) => Math.min(i + 1, questions.length - 1));
  };
  const goPrev = () => {
    setActiveIndex((i) => Math.max(i - 1, 0));
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("categoryId", String(categoryId));
    data.set("userId", String(userId));

    const res = await fetch("/api/admin/questions/create", {
      method: "POST",
      body: data,
    });

    if (res.ok) {
      const newQ: Question = {
        id: Date.now(),
        question: (data.get("question") as string).trim(),
        answer: (data.get("answer") as string).trim(),
        longAnswer: (data.get("longAnswer") as string)?.trim() || null,
      };
      const updated = [...questions, newQ];
      setQuestions(updated);
      setActiveIndex(updated.length - 1);
      setShowAdd(false);
      form.reset();
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("categoryId", String(categoryId));

    const res = await fetch("/api/admin/questions/update", {
      method: "POST",
      body: data,
    });

    if (res.ok) {
      const id = Number(data.get("id"));
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === id
            ? {
                ...q,
                question: (data.get("question") as string).trim(),
                answer: (data.get("answer") as string).trim(),
                longAnswer: (data.get("longAnswer") as string)?.trim() || null,
              }
            : q
        )
      );
      setEditingId(null);
    }
  };

  const handleDelete = async (questionId: number) => {
    const data = new FormData();
    data.set("id", String(questionId));
    data.set("categoryId", String(categoryId));

    const res = await fetch("/api/admin/questions/delete", {
      method: "POST",
      body: data,
    });

    if (res.ok) {
      const updated = questions.filter((q) => q.id !== questionId);
      setQuestions(updated);
      setDeletingId(null);
      if (activeIndex >= updated.length) {
        setActiveIndex(Math.max(0, updated.length - 1));
      }
    }
  };

  if (questions.length === 0 && !showAdd) {
    return (
      <main className="flex-1 flex flex-col bg-void">
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
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="flex flex-col items-center text-center animate-fade-in">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-elevated">
              <Layers className="h-8 w-8 text-muted" strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-xl text-ash">No cards yet</h2>
            {isAdmin && (
              <button
                onClick={() => setShowAdd(true)}
                className="btn-primary gap-2 mt-4"
              >
                <Plus className="h-4 w-4" strokeWidth={2} />
                Add Card
              </button>
            )}
          </div>
        </div>
        {showAdd && isAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowAdd(false)}
            />
            <div className="relative bg-abyss border border-border rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-medium text-chalk">Add Card</h2>
                <button
                  onClick={() => setShowAdd(false)}
                  className="p-1.5 rounded-lg text-muted hover:text-chalk hover:bg-elevated transition-colors"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ash">Question</label>
                  <textarea name="question" required rows={2} className="input-field resize-none" placeholder="Enter the question..." autoFocus />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ash">
                    Short Answer <span className="text-muted text-xs">(shown on flashcards)</span>
                  </label>
                  <textarea name="answer" required rows={2} className="input-field resize-none" placeholder="Brief answer for the card flip..." />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ash">
                    Long Answer <span className="text-muted text-xs">(shown in Learn mode, optional, supports **markdown**)</span>
                  </label>
                  <textarea name="longAnswer" rows={3} className="input-field resize-none" placeholder="Detailed explanation for study mode..." />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="submit" className="btn-primary">Add Card</button>
                  <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    );
  }

  const displayAnswer = currentQuestion?.longAnswer || currentQuestion?.answer;

  const sidebarContent = (
    <div className="flex-1 overflow-y-auto py-1">
      {isAdmin && (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full text-left px-4 py-2.5 transition-all duration-150 group border-l-2 border-l-transparent hover:bg-elevated/50 hover:border-l-border-light"
        >
          <div className="flex items-center gap-2.5">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-amber/10 text-[10px] font-medium text-amber">
              <Plus className="h-3 w-3" strokeWidth={2} />
            </span>
            <span className="text-sm leading-snug text-amber">Add card</span>
          </div>
        </button>
      )}
      {questions.map((q, i) => (
        <div
          key={q.id}
          role="button"
          tabIndex={0}
          onClick={() => {
            setActiveIndex(i);
            setSidebarOpen(false);
          }}
          onKeyDown={(e) => { if (e.key === "Enter") { setActiveIndex(i); setSidebarOpen(false); } }}
          className={`w-full text-left px-4 py-2.5 transition-all duration-150 group cursor-pointer ${
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
              className={`text-sm leading-snug line-clamp-2 transition-colors flex-1 ${
                activeIndex === i
                  ? "text-chalk"
                  : "text-muted group-hover:text-ash"
              }`}
            >
              {q.question}
            </span>
            {isAdmin && activeIndex === i && (
              <span className="flex items-center gap-0.5 shrink-0 opacity-100">
                <button
                  onClick={(e) => { e.stopPropagation(); setEditingId(q.id); setSidebarOpen(false); }}
                  className="p-1 rounded text-muted hover:text-chalk hover:bg-elevated transition-colors"
                  title="Edit"
                >
                  <Pencil className="h-3 w-3" strokeWidth={1.5} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeletingId(q.id); }}
                  className="p-1 rounded text-muted hover:text-ember-light hover:bg-ember/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3" strokeWidth={1.5} />
                </button>
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const sidebarHeader = (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
      <p className="text-[11px] text-muted">
        {questions.length} card{questions.length !== 1 ? "s" : ""}
      </p>
      {mode === "learn" && (
        <button
          onClick={() => setSidebarHidden(true)}
          className="p-1.5 rounded-lg text-muted hover:text-chalk hover:bg-elevated transition-colors"
          title="Hide sidebar"
        >
          <PanelLeftClose className="h-4 w-4" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );

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
          {mode === "learn" && !sidebarHidden && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-muted hover:text-chalk hover:bg-elevated transition-colors"
            >
              <Menu className="h-4 w-4" strokeWidth={1.5} />
            </button>
          )}

          {mode === "learn" && sidebarHidden && (
            <button
              onClick={() => setSidebarHidden(false)}
              className="p-1.5 rounded-lg text-muted hover:text-chalk hover:bg-elevated transition-colors"
              title="Show sidebar"
            >
              <PanelLeft className="h-4 w-4" strokeWidth={1.5} />
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

          {isAdmin && (
            <button
              onClick={() => setShowAdd(true)}
              className="p-1.5 rounded-lg text-muted hover:text-amber hover:bg-elevated transition-colors"
              title="Add card"
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
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
            {sidebarHeader}
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Content */}
      {mode === "cards" ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
          {currentQuestion && (
            <>
              <FlipCard
                question={currentQuestion.question}
                answer={currentQuestion.answer}
                index={activeIndex}
                key={currentQuestion.id}
              />
              <div className="flex items-center gap-3 mt-4">
                {isAdmin && (
                  <>
                    <button
                      onClick={() => setEditingId(currentQuestion.id)}
                      className="btn-secondary gap-1.5 text-sm py-2 px-3"
                    >
                      <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletingId(currentQuestion.id)}
                      className="btn-secondary gap-1.5 text-sm py-2 px-3 text-ember-light hover:bg-ember/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </>
          )}
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
          {!sidebarHidden && (
            <aside className="hidden md:flex w-72 shrink-0 border-r border-border bg-abyss/50 flex-col">
              {sidebarHeader}
              {sidebarContent}
            </aside>
          )}

          {/* Learn main area */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
            {editingId !== null && currentQuestion && isAdmin ? (
              <div className="w-full max-w-lg animate-fade-in">
                <div className="card-base p-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-display text-lg font-medium text-chalk">Edit Card</h2>
                    <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg text-muted hover:text-chalk hover:bg-elevated transition-colors">
                      <X className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                  <form onSubmit={handleEdit} className="space-y-3">
                    <input type="hidden" name="id" value={currentQuestion.id} />
                    <input type="hidden" name="categoryId" value={categoryId} />
                    <div>
                      <label className="mb-1 block text-xs text-muted">Question</label>
                      <textarea name="question" required rows={2} defaultValue={currentQuestion.question} className="input-field resize-none text-sm" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted">Short Answer</label>
                      <textarea name="answer" required rows={2} defaultValue={currentQuestion.answer} className="input-field resize-none text-sm" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted">
                        Long Answer <span className="text-muted/60">(optional, for Learn mode, supports **markdown**)</span>
                      </label>
                      <textarea name="longAnswer" rows={3} defaultValue={currentQuestion.longAnswer || ""} className="input-field resize-none text-sm" />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="btn-primary text-xs py-1.5 px-3 gap-1">
                        <Check className="h-3 w-3" strokeWidth={2} />
                        Save
                      </button>
                      <button type="button" onClick={() => setEditingId(null)} className="btn-secondary text-xs py-1.5 px-3">Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            ) : deletingId !== null && currentQuestion && isAdmin ? (
              <div className="w-full max-w-md animate-fade-in">
                <div className="card-base p-6 text-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ember/10 mx-auto">
                    <Trash2 className="h-6 w-6 text-ember-light" strokeWidth={1.5} />
                  </div>
                  <h2 className="font-display text-lg font-medium text-chalk">Delete this card?</h2>
                  <p className="text-sm text-muted line-clamp-2">{currentQuestion.question}</p>
                  <div className="flex gap-3 justify-center pt-2">
                    <button onClick={() => setDeletingId(null)} className="btn-secondary">Cancel</button>
                    <button onClick={() => handleDelete(deletingId)} className="btn-danger">Delete</button>
                  </div>
                </div>
              </div>
            ) : currentQuestion ? (
              <div className="w-full max-w-xl animate-fade-in" key={currentQuestion.id}>
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sage/10 text-xs font-medium text-sage">
                    {activeIndex + 1}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-sage">Answer</span>
                </div>
                <Markdown content={displayAnswer} />
                {isAdmin && (
                  <div className="flex items-center gap-2 mt-4">
                    <button onClick={() => setEditingId(currentQuestion.id)} className="btn-secondary gap-1.5 text-sm py-2 px-3">
                      <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                      Edit
                    </button>
                    <button onClick={() => setDeletingId(currentQuestion.id)} className="btn-secondary gap-1.5 text-sm py-2 px-3 text-ember-light hover:bg-ember/10">
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            {editingId === null && deletingId === null && (
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
            )}
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showAdd && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAdd(false)}
          />
          <div className="relative bg-abyss border border-border rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-medium text-chalk">Add Card</h2>
              <button
                onClick={() => setShowAdd(false)}
                className="p-1.5 rounded-lg text-muted hover:text-chalk hover:bg-elevated transition-colors"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ash">Question</label>
                <textarea name="question" required rows={2} className="input-field resize-none" placeholder="Enter the question..." autoFocus />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ash">
                  Short Answer <span className="text-muted text-xs">(shown on flashcards)</span>
                </label>
                <textarea name="answer" required rows={2} className="input-field resize-none" placeholder="Brief answer for the card flip..." />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ash">
                  Long Answer <span className="text-muted text-xs">(shown in Learn mode, optional, supports **markdown**)</span>
                </label>
                <textarea name="longAnswer" rows={3} className="input-field resize-none" placeholder="Detailed explanation for study mode..." />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="submit" className="btn-primary">Add Card</button>
                <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}