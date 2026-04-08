import { NextRequest, NextResponse } from "next/server";
import { login, createSessionToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" });
  }

  const user = await login(username, password);
  if (!user) {
    return NextResponse.json({ error: "Invalid username or password" });
  }

  const token = await createSessionToken(user.id, user.role);

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