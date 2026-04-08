"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Check } from "lucide-react";

interface Question {
  id: number;
  question: string;
  answer: string;
  longAnswer: string | null;
  categoryId: number;
}

export default function QuestionListClient({
  questions: initialQuestions,
  categoryId,
  userId,
}: {
  questions: Question[];
  categoryId: number;
  userId: number;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowAdd(true)}
        className="btn-primary gap-2 animate-fade-in"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
        Add Card
      </button>

      {showAdd && (
        <form
          action="/api/admin/questions/create"
          method="POST"
          className="card-base p-6 space-y-4 animate-fade-in"
        >
          <input type="hidden" name="categoryId" value={categoryId} />
          <input type="hidden" name="userId" value={userId} />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ash">
              Question
            </label>
            <textarea
              name="question"
              required
              rows={2}
              className="input-field resize-none"
              placeholder="Enter the question..."
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ash">
              Short Answer <span className="text-muted text-xs">(shown on flashcards)</span>
            </label>
            <textarea
              name="answer"
              required
              rows={2}
              className="input-field resize-none"
              placeholder="Brief answer for the card flip..."
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ash">
              Long Answer <span className="text-muted text-xs">(shown in Learn mode, optional)</span>
            </label>
            <textarea
              name="longAnswer"
              rows={3}
              className="input-field resize-none"
              placeholder="Detailed explanation for study mode. If empty, short answer is used."
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary">
              Add Card
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {initialQuestions.length === 0 && !showAdd ? (
        <div className="flex flex-col items-center py-16 text-center animate-fade-in">
          <p className="text-ash">No cards in this category yet</p>
          <p className="mt-1 text-sm text-muted">
            Click &ldquo;Add Card&rdquo; to create your first flashcard
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {initialQuestions.map((q, i) => (
            <div
              key={q.id}
              className="card-base p-4 animate-fade-in"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              {editingId === q.id ? (
                <EditForm
                  question={q}
                  categoryId={categoryId}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-amber/10 text-[10px] font-medium text-amber">
                        {i + 1}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.15em] text-muted">
                        Question
                      </span>
                    </div>
                    <p className="text-sm text-chalk leading-relaxed">
                      {q.question}
                    </p>
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <span className="text-[10px] uppercase tracking-[0.15em] text-sage">
                        Short Answer
                      </span>
                      <p className="mt-0.5 text-sm text-ash leading-relaxed">
                        {q.answer}
                      </p>
                      {q.longAnswer && (
                        <div className="mt-2 pt-2 border-t border-border/30">
                          <span className="text-[10px] uppercase tracking-[0.15em] text-amber/70">
                            Long Answer
                          </span>
                          <p className="mt-0.5 text-sm text-muted leading-relaxed">
                            {q.longAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setEditingId(q.id)}
                      className="p-1.5 rounded-md text-muted hover:text-chalk hover:bg-elevated transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                    <DeleteForm
                      questionId={q.id}
                      categoryId={categoryId}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EditForm({
  question,
  categoryId,
  onCancel,
}: {
  question: Question;
  categoryId: number;
  onCancel: () => void;
}) {
  return (
    <form
      action="/api/admin/questions/update"
      method="POST"
      className="space-y-3"
    >
      <input type="hidden" name="id" value={question.id} />
      <input type="hidden" name="categoryId" value={categoryId} />
      <div>
        <label className="mb-1 block text-xs text-muted">Question</label>
        <textarea
          name="question"
          required
          rows={2}
          defaultValue={question.question}
          className="input-field resize-none text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Short Answer</label>
        <textarea
          name="answer"
          required
          rows={2}
          defaultValue={question.answer}
          className="input-field resize-none text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">
          Long Answer <span className="text-muted/60">(optional, for Learn mode)</span>
        </label>
        <textarea
          name="longAnswer"
          rows={3}
          defaultValue={question.longAnswer || ""}
          className="input-field resize-none text-sm"
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary text-xs py-1.5 px-3 gap-1">
          <Check className="h-3 w-3" strokeWidth={2} />
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary text-xs py-1.5 px-3"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function DeleteForm({
  questionId,
  categoryId,
}: {
  questionId: number;
  categoryId: number;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <form action="/api/admin/questions/delete" method="POST">
        <input type="hidden" name="id" value={questionId} />
        <input type="hidden" name="categoryId" value={categoryId} />
        <button
          type="submit"
          className="p-1.5 rounded-md text-ember-light hover:bg-ember/20 transition-colors"
          title="Confirm delete"
        >
          <Check className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      </form>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-1.5 rounded-md text-muted hover:text-ember-light hover:bg-ember/10 transition-colors"
      title="Delete"
    >
      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
    </button>
  );
}