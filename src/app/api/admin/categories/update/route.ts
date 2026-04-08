import { NextRequest, NextResponse } from "next/server";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const id = Number(formData.get("id"));
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name?.trim()) {
    return NextResponse.redirect(new URL(`/admin/categories/${id}/edit`, request.url));
  }

  const db = getDb();
  await db
    .update(schema.categories)
    .set({ name: name.trim(), description: description?.trim() || null })
    .where(eq(schema.categories.id, id));

  revalidatePath("/admin/categories");
  return NextResponse.redirect(new URL("/admin/categories", request.url));
}