import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCategoryById } from "@/lib/actions";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import Nav from "@/components/Nav";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/categories");

  const { id } = await params;
  const category = await getCategoryById(Number(id));
  if (!category) redirect("/admin/categories");

  const db = getDb();
  const user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, session.userId))
    .get();

  return (
    <>
      <Nav role="admin" name={user?.name || "Admin"} />
      <main className="mx-auto max-w-xl px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-chalk">
            Edit Category
          </h1>
          <p className="mt-1 text-sm text-muted">
            Update &ldquo;{category.name}&rdquo;
          </p>
        </div>

        <form
          action="/api/admin/categories/update"
          method="POST"
          className="space-y-5 card-base p-6 animate-fade-in"
        >
          <input type="hidden" name="id" value={category.id} />

          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-ash"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={category.name}
              className="input-field"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-medium text-ash"
            >
              Description{" "}
              <span className="text-muted">(optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={category.description || ""}
              className="input-field resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <a href="/admin/categories" className="btn-secondary">
              Cancel
            </a>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </>
  );
}