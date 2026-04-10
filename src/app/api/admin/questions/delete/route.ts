import { NextRequest, NextResponse } from "next/server";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const id = Number(formData.get("id"));
  const categoryId = Number(formData.get("categoryId"));

  const db = getDb();
  await db.delete(schema.questions).where(eq(schema.questions.id, id));

  revalidatePath(`/categories/${categoryId}`);
  return NextResponse.json({ success: true });
}