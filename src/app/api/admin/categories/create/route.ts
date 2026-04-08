import { NextRequest, NextResponse } from "next/server";
import { getDb, schema } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const userId = Number(formData.get("userId"));

  if (!name?.trim()) {
    return NextResponse.redirect(new URL("/admin/categories/new", request.url));
  }

  const db = getDb();
  await db.insert(schema.categories).values({
    name: name.trim(),
    description: description?.trim() || null,
    createdBy: userId,
  });

  revalidatePath("/admin/categories");
  return NextResponse.redirect(new URL("/admin/categories", request.url));
}