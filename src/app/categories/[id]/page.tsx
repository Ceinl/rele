import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCategoryById, getQuestionsByCategory } from "@/lib/actions";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import Nav from "@/components/Nav";
import QuestionViewClient from "./QuestionViewClient";

export default async function QuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const categoryId = Number(id);

  const [category, questions] = await Promise.all([
    getCategoryById(categoryId),
    getQuestionsByCategory(categoryId),
  ]);

  if (!category) redirect("/categories");

  const db = getDb();
  const user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, session.userId))
    .get();

  const serializedQuestions = questions.map((q) => ({
    id: q.id,
    question: q.question,
    answer: q.answer,
    longAnswer: q.longAnswer,
  }));

  return (
    <>
      <Nav role={session.role} name={user?.name || "User"} />
      <QuestionViewClient
        category={category}
        questions={serializedQuestions}
        categoryId={categoryId}
        userId={session.userId}
        isAdmin={session.role === "admin"}
      />
    </>
  );
}