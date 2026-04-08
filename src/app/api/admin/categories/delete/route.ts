import { deleteCategory } from "@/lib/actions";

export async function POST(request: Request) {
  const formData = await request.formData();
  await deleteCategory(formData);
  return new Response(null, { status: 302, headers: { Location: "/admin/categories" } });
}