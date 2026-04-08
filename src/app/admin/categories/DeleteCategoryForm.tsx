"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteCategoryForm({
  categoryId,
  categoryName,
}: {
  categoryId: number;
  categoryName: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-ember-light">Delete?</span>
        <form action="/api/admin/categories/delete" method="POST">
          <input type="hidden" name="id" value={categoryId} />
          <button
            type="submit"
            className="btn-danger text-xs py-1.5 px-2.5"
          >
            Yes
          </button>
        </form>
        <button
          onClick={() => setConfirming(false)}
          className="btn-secondary text-xs py-1.5 px-2.5"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="btn-danger gap-2 text-sm py-2 px-3"
    >
      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
    </button>
  );
}