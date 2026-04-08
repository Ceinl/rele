import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCategories } from "@/lib/actions";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import Nav from "@/components/Nav";
import Link from "next/link";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import DeleteCategoryForm from "./DeleteCategoryForm";

export default async function AdminCategoriesPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/categories");

  const db = getDb();
  const [categories, user] = await Promise.all([
    getCategories(),
    db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, session.userId))
      .get(),
  ]);

  return (
    <>
      <Nav role="admin" name={user?.name || "Admin"} />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 animate-fade-in gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-chalk">
              Manage Categories
            </h1>
            <p className="mt-1 sm:mt-2 text-muted text-sm sm:text-base">
              Create and organize your study categories
            </p>
          </div>
          <Link href="/admin/categories/new" className="btn-primary gap-2">
            <Plus className="h-4 w-4" strokeWidth={2} />
            New Category
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-elevated">
              <FileText className="h-8 w-8 text-muted" strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-xl text-ash">
              No categories yet
            </h2>
            <p className="mt-1 text-sm text-muted">
              Create your first category to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((cat, i) => (
              <div
                key={cat.id}
                className="card-base p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between animate-fade-in gap-3"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg font-medium text-chalk">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="mt-0.5 text-sm text-muted truncate">
                      {cat.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted">
                    <span className="inline-flex items-center gap-1 rounded-full bg-elevated px-2.5 py-0.5">
                      {cat.questionCount} card
                      {cat.questionCount !== 1 ? "s" : ""}
                    </span>
                    <span>by {cat.userName || "Unknown"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/admin/categories/${cat.id}/questions`}
                    className="btn-secondary gap-2 text-sm py-2 px-3"
                  >
                    <FileText className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Cards
                  </Link>
                  <Link
                    href={`/admin/categories/${cat.id}/edit`}
                    className="btn-secondary gap-2 text-sm py-2 px-3"
                  >
                    <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Edit
                  </Link>
                  <DeleteCategoryForm categoryId={cat.id} categoryName={cat.name} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}