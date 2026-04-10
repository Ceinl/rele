import { NextRequest, NextResponse } from "next/server";
import { getDb, schema } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const categoryId = Number(formData.get("categoryId"));
  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;
  const longAnswer = formData.get("longAnswer") as string | null;
  const userId = Number(formData.get("userId"));

  if (!question?.trim() || !answer?.trim()) {
    return NextResponse.json({ error: "Question and answer are required" }, { status: 400 });
  }

  const db = getDb();
  const result = await db.insert(schema.questions).values({
    categoryId,
    question: question.trim(),
    answer: answer.trim(),
    longAnswer: longAnswer?.trim() || null,
    createdBy: userId,
  }).returning();

  revalidatePath(`/categories/${categoryId}`);
  return NextResponse.json({ success: true, question: result[0] });
}