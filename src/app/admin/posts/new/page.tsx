import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/lib/auth";

export default async function NewPostPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/admin/login");
  const session = await verifySessionToken(token);
  if (!session) redirect("/admin/login");

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-center justify-between border-b border-stone-200 pb-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Editor</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-900">New story</h1>
        </div>
        <a href="/admin" className="text-sm font-medium text-stone-700 hover:text-stone-900">Back to dashboard</a>
      </header>

      <form action="/api/posts" method="post" className="space-y-6">
        <input type="hidden" name="intent" value="create" />
        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.5fr]">
          <div className="space-y-6">
            <label className="block text-sm font-medium text-stone-700">
              Title
              <input name="title" required className="mt-2 w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-stone-900 outline-none focus:border-stone-500" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Slug
              <input name="slug" className="mt-2 w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-stone-900 outline-none focus:border-stone-500" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Tags
              <input name="tags" placeholder="news, policy, culture" className="mt-2 w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-stone-900 outline-none focus:border-stone-500" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Cover image URL
              <input name="coverImageUrl" placeholder="/uploads/cover.jpg" className="mt-2 w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-stone-900 outline-none focus:border-stone-500" />
            </label>
          </div>

          <aside className="space-y-6 rounded-2xl border border-stone-200 bg-white p-5">
            <label className="block text-sm font-medium text-stone-700">
              Status
              <select name="status" className="mt-2 w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-stone-900 outline-none focus:border-stone-500">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <button type="submit" className="w-full rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-700">Save post</button>
          </aside>
        </div>

        <label className="block text-sm font-medium text-stone-700">
          Body (Markdown)
          <textarea name="body" rows={18} required className="mt-2 w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-stone-900 outline-none focus:border-stone-500" />
        </label>
      </form>
    </main>
  );
}
