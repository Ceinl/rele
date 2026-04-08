"use server";

import { getDb, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { login as authLogin, hashPassword, logout as authLogout } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function loginUser(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) return { error: "Username and password are required" };

  const user = await authLogin(username, password);
  if (!user) return { error: "Invalid username or password" };

  redirect("/categories");
}

export async function logoutUser() {
  await authLogout();
  redirect("/login");
}

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const userId = formData.get("userId") as string;

  if (!name?.trim()) return { error: "Category name is required" };

  const db = getDb();
  await db.insert(schema.categories).values({
    name: name.trim(),
    description: description?.trim() || null,
    createdBy: Number(userId),
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name?.trim()) return { error: "Category name is required" };

  const db = getDb();
  await db
    .update(schema.categories)
    .set({ name: name.trim(), description: description?.trim() || null })
    .where(eq(schema.categories.id, id));

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  const id = Number(formData.get("id"));
  const db = getDb();

  await db.delete(schema.questions).where(eq(schema.questions.categoryId, id));
  await db.delete(schema.categories).where(eq(schema.categories.id, id));

  revalidatePath("/admin/categories");
}

export async function createQuestion(formData: FormData) {
  const categoryId = Number(formData.get("categoryId"));
  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;
  const userId = formData.get("userId") as string;

  if (!question?.trim() || !answer?.trim())
    return { error: "Question and answer are required" };

  const db = getDb();
  await db.insert(schema.questions).values({
    categoryId,
    question: question.trim(),
    answer: answer.trim(),
    createdBy: Number(userId),
  });

  revalidatePath(`/admin/categories/${categoryId}/questions`);
  redirect(`/admin/categories/${categoryId}/questions`);
}

export async function updateQuestion(formData: FormData) {
  const id = Number(formData.get("id"));
  const categoryId = Number(formData.get("categoryId"));
  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;

  if (!question?.trim() || !answer?.trim())
    return { error: "Question and answer are required" };

  const db = getDb();
  await db
    .update(schema.questions)
    .set({ question: question.trim(), answer: answer.trim() })
    .where(eq(schema.questions.id, id));

  revalidatePath(`/admin/categories/${categoryId}/questions`);
  redirect(`/admin/categories/${categoryId}/questions`);
}

export async function deleteQuestion(formData: FormData) {
  const id = Number(formData.get("id"));
  const categoryId = Number(formData.get("categoryId"));

  const db = getDb();
  await db.delete(schema.questions).where(eq(schema.questions.id, id));

  revalidatePath(`/admin/categories/${categoryId}/questions`);
}

export async function getCategories() {
  const db = getDb();
  const cats = await db
    .select({
      id: schema.categories.id,
      name: schema.categories.name,
      description: schema.categories.description,
      createdBy: schema.categories.createdBy,
      createdAt: schema.categories.createdAt,
      userName: schema.users.name,
    })
    .from(schema.categories)
    .leftJoin(schema.users, eq(schema.categories.createdBy, schema.users.id))
    .orderBy(desc(schema.categories.createdAt));

  const allQuestions = await db
    .select({ categoryId: schema.questions.categoryId })
    .from(schema.questions);

  const countMap = new Map<number, number>();
  for (const q of allQuestions) {
    countMap.set(q.categoryId, (countMap.get(q.categoryId) || 0) + 1);
  }

  return cats.map((cat) => ({
    ...cat,
    questionCount: countMap.get(cat.id) || 0,
  }));
}

export async function getQuestionsByCategory(categoryId: number) {
  const db = getDb();
  return db
    .select()
    .from(schema.questions)
    .where(eq(schema.questions.categoryId, categoryId))
    .orderBy(schema.questions.id);
}

export async function getCategoryById(id: number) {
  const db = getDb();
  return db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.id, id))
    .get();
}

export async function registerUser(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!username || !password || !name)
    return { error: "All fields are required" };

  const db = getDb();
  const existing = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.username, username))
    .get();

  if (existing) return { error: "Username already taken" };

  const hashed = await hashPassword(password);
  await db.insert(schema.users).values({
    username: username.trim(),
    password: hashed,
    name: name.trim(),
    role: "user",
  });

  revalidatePath("/login");
  redirect("/login");
}