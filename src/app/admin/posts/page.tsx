import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { verifySessionToken } from "@/lib/auth";

export default async function AdminPostsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/admin/login");

  const session = await verifySessionToken(token);
  if (!session) redirect("/admin/login");

  await dbConnect();
  const posts = await Post.find({})
    .sort({ updatedAt: -1 })
    .lean();

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between gap-3 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">Content</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">All stories</h1>
        </div>
        <Link href="/admin/posts/new" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500">
          New article
        </Link>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Drafts & published</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{posts.length} total</span>
        </div>

        <div className="space-y-3">
          {posts.length === 0 ? (
            <p className="text-sm text-slate-500">No posts yet. Create your first draft.</p>
          ) : (
            posts.map((post) => (
              <div key={String(post._id)} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-base font-semibold text-slate-900">{String(post.title || "Untitled story")}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span className={`rounded-full px-2 py-1 font-medium ${post.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {String(post.status)}
                    </span>
                    <span>{post.updatedAt ? new Date(post.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently updated"}</span>
                  </div>
                </div>

                <Link href={`/admin/posts/${String(post._id)}/edit`} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-blue-200 hover:text-blue-700">
                  Open
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
