import { getSession } from "@/lib/auth";
import { getCategories } from "@/lib/actions";
import { redirect } from "next/navigation";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import Nav from "@/components/Nav";
import Link from "next/link";
import { Library, ArrowRight, FileText } from "lucide-react";

export default async function CategoriesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [categories, user] = await Promise.all([
    getCategories(),
    getDb()
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, session.userId))
      .get(),
  ]);

  return (
    <>
      <Nav role={session.role} name={user?.name || "User"} />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-8 sm:mb-10 animate-fade-in">
          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-chalk">
            Your Study Library
          </h1>
          <p className="mt-1 sm:mt-2 text-muted text-sm sm:text-base">
            Pick a category and start reviewing
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-elevated">
              <Library className="h-8 w-8 text-muted" strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-xl text-ash">
              No categories yet
            </h2>
            <p className="mt-1 text-sm text-muted">
              Ask an admin to create some study categories
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="group card-base p-6 hover:border-amber/40 hover:glow-amber animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10 text-amber transition-colors group-hover:bg-amber/15">
                    <FileText className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted transition-all duration-200 group-hover:text-amber group-hover:translate-x-0.5" />
                </div>
                <h3 className="font-display text-lg font-medium text-chalk group-hover:text-amber-light transition-colors">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="mt-1.5 text-sm text-muted line-clamp-2">
                    {cat.description}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-2 text-xs text-muted">
                  <span className="inline-flex items-center gap-1 rounded-full bg-elevated px-2.5 py-0.5">
                    {cat.questionCount} card
                    {cat.questionCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}