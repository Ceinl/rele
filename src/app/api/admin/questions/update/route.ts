import { NextRequest, NextResponse } from "next/server";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const id = Number(formData.get("id"));
  const categoryId = Number(formData.get("categoryId"));
  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;
  const longAnswer = formData.get("longAnswer") as string | null;

  if (!question?.trim() || !answer?.trim()) {
    return NextResponse.redirect(
      new URL(`/admin/categories/${categoryId}/questions`, request.url)
    );
  }

  const db = getDb();
  await db
    .update(schema.questions)
    .set({
      question: question.trim(),
      answer: answer.trim(),
      longAnswer: longAnswer?.trim() || null,
    })
    .where(eq(schema.questions.id, id));

  revalidatePath(`/admin/categories/${categoryId}/questions`);
  return NextResponse.redirect(
    new URL(`/admin/categories/${categoryId}/questions`, request.url)
  );
}