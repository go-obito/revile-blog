import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { Comment } from "@/lib/models/Comment";
import { verifySessionToken } from "@/lib/auth";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/admin/login");

  const session = await verifySessionToken(token);
  if (!session) redirect("/admin/login");

  await dbConnect();
  const [posts, totalComments, pendingComments] = await Promise.all([
    Post.find().sort({ updatedAt: -1 }).lean(),
    Comment.countDocuments(),
    Comment.countDocuments({ status: "pending" }),
  ]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_35%),_linear-gradient(180deg,#f8fbff_0%,#edf4ff_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 rounded-[28px] border border-blue-100 bg-white/90 px-5 py-5 shadow-[0_20px_45px_rgba(37,99,235,0.08)] backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">Writer desk</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">Revile admin</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/posts/new" className="primary-button nav-cta inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5">New post</Link>
            <form action="/api/auth/logout" method="post">
              <button type="submit" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">Logout</button>
            </form>
          </div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Posts" value={String(posts.length)} />
          <StatCard label="Comments" value={String(totalComments)} href="/admin/comments" />
          <StatCard label="Pending" value={String(pendingComments)} href="/admin/comments" highlight />
        </section>

        <section className="mt-10 overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Posts</h2>
            <Link href="/admin/insights" className="text-sm font-medium text-blue-700 hover:text-blue-900">Insights</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-blue-50 text-blue-900">
                <tr>
                  <th className="px-6 py-3 font-semibold">Title</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Updated</th>
                  <th className="px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {posts.map((post) => (
                  <tr key={String(post._id)} className="hover:bg-blue-50/60">
                    <td className="px-6 py-4 font-medium text-slate-900">{post.title}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${post.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{new Date(post.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/posts/${String(post._id)}/edit`} className="text-blue-700 hover:text-blue-900">Edit</Link>
                        <form action="/api/posts" method="post" className="inline-block">
                          <input type="hidden" name="intent" value="delete" />
                          <input type="hidden" name="id" value={String(post._id)} />
                          <button type="submit" className="text-red-600 hover:text-red-800">Delete</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value, href, highlight = false }: { label: string; value: string; href?: string; highlight?: boolean }) {
  const classes = highlight
    ? "rounded-[22px] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm"
    : "rounded-[22px] border border-blue-100 bg-white p-5 shadow-sm";

  const content = (
    <>
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
    </>
  );

  if (href) {
    return <Link href={href} className={`${classes} transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md`}>{content}</Link>;
  }

  return <div className={`${classes} transition hover:-translate-y-0.5`}>{content}</div>;
}
