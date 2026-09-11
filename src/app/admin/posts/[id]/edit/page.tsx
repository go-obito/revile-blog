import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { verifySessionToken } from "@/lib/auth";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/admin/login");
  const session = await verifySessionToken(token);
  if (!session) redirect("/admin/login");

  await dbConnect();
  const post = await Post.findById(id).lean();
  if (!post) redirect("/admin");

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-center justify-between border-b border-stone-200 pb-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Editor</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-900">Edit story</h1>
        </div>
        <Link href="/admin" className="text-sm font-medium text-stone-700 hover:text-stone-900">Back to dashboard</Link>
      </header>

      <form action="/api/posts" method="post" className="space-y-6">
        <input type="hidden" name="intent" value="update" />
        <input type="hidden" name="id" value={String(post._id)} />
        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.5fr]">
          <div className="space-y-6">
            <label className="block text-sm font-medium text-stone-700">
              Title
              <input name="title" defaultValue={post.title} required className="mt-2 w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-stone-900 outline-none focus:border-stone-500" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Slug
              <input name="slug" defaultValue={post.slug} className="mt-2 w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-stone-900 outline-none focus:border-stone-500" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Tags
              <input name="tags" defaultValue={(post.tags ?? []).join(", ")} className="mt-2 w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-stone-900 outline-none focus:border-stone-500" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Cover image URL
              <input name="coverImageUrl" defaultValue={post.coverImageUrl ?? ""} className="mt-2 w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-stone-900 outline-none focus:border-stone-500" />
            </label>
          </div>

          <aside className="space-y-6 rounded-2xl border border-stone-200 bg-white p-5">
            <label className="block text-sm font-medium text-stone-700">
              Status
              <select name="status" defaultValue={post.status} className="mt-2 w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-stone-900 outline-none focus:border-stone-500">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <button type="submit" className="w-full rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-700">Save changes</button>
          </aside>
        </div>

        <label className="block text-sm font-medium text-stone-700">
          Body (Markdown)
          <textarea name="body" rows={18} required defaultValue={post.body} className="mt-2 w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-stone-900 outline-none focus:border-stone-500" />
        </label>
      </form>
    </main>
  );
}
