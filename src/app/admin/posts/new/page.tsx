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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_35%),linear-gradient(180deg,#f8fbff_0%,#edf4ff_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 rounded-[28px] border border-blue-100 bg-white/90 px-5 py-5 shadow-[0_18px_40px_rgba(37,99,235,0.08)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">Editor</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">New story</h1>
          </div>
          <a href="/admin" className="text-sm font-medium text-blue-700 hover:text-blue-900">Back to dashboard</a>
        </header>

        <form action="/api/posts" method="post" className="space-y-6">
          <input type="hidden" name="intent" value="create" />
          <div className="grid gap-6 xl:grid-cols-[1.5fr_0.5fr]">
            <div className="space-y-6">
              <label className="block text-sm font-medium text-slate-700">
                Title
                <input name="title" required className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Slug
                <input name="slug" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Tags
                <input name="tags" placeholder="news, policy, culture" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Cover image URL
                <input name="coverImageUrl" placeholder="/uploads/cover.jpg" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white" />
              </label>
            </div>

            <aside className="space-y-6 rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm">
              <label className="block text-sm font-medium text-slate-700">
                Status
                <select name="status" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
              <button type="submit" className="primary-button nav-cta w-full rounded-full px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5">Save post</button>
            </aside>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Body (Markdown)
            <textarea name="body" rows={18} required className="mt-2 w-full rounded-[22px] border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white" />
          </label>
        </form>
      </div>
    </main>
  );
}
