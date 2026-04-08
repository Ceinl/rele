import { NextRequest, NextResponse } from "next/server";
import { hashPassword, createSessionToken } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!username || !password || !name) {
    return NextResponse.json({ error: "All fields are required" });
  }

  const db = getDb();

  const existing = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.username, username))
    .get();

  if (existing) {
    return NextResponse.json({ error: "Username already taken" });
  }

  const hashed = await hashPassword(password);
  const result = await db
    .insert(schema.users)
    .values({
      username: username.trim(),
      password: hashed,
      name: name.trim(),
      role: "user",
    })
    .returning()
    .get();

  const token = await createSessionToken(result.id, result.role);

  const response = NextResponse.json({ ok: true });
  response.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}