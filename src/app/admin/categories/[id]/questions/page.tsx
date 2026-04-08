import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCategoryById, getQuestionsByCategory } from "@/lib/actions";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import Nav from "@/components/Nav";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import QuestionListClient from "./QuestionListClient";

export default async function AdminQuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/categories");

  const { id } = await params;
  const categoryId = Number(id);

  const [category, questions] = await Promise.all([
    getCategoryById(categoryId),
    getQuestionsByCategory(categoryId),
  ]);

  if (!category) redirect("/admin/categories");

  const db = getDb();
  const user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, session.userId))
    .get();

  return (
    <>
      <Nav role="admin" name={user?.name || "Admin"} />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-amber transition-colors mb-2"
          >
            <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
            Back to categories
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-chalk">
            {category.name}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {questions.length} card{questions.length !== 1 ? "s" : ""}
          </p>
        </div>

        <QuestionListClient
          questions={questions.map((q) => ({
            id: q.id,
            question: q.question,
            answer: q.answer,
            longAnswer: q.longAnswer,
            categoryId: q.categoryId,
          }))}
          categoryId={categoryId}
          userId={session.userId}
        />
      </main>
    </>
  );
}