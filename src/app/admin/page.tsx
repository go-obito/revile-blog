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
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Dashboard</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-900">Revile admin</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/posts/new" className="rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-700">New post</Link>
          <form action="/api/auth/logout" method="post">
            <button type="submit" className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 hover:border-stone-400">Logout</button>
          </form>
        </div>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Posts" value={String(posts.length)} />
        <StatCard label="Comments" value={String(totalComments)} href="/admin/comments" />
        <StatCard label="Pending" value={String(pendingComments)} href="/admin/comments" highlight />
      </section>

      <section className="mt-10 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-stone-900">Posts</h2>
          <Link href="/admin/insights" className="text-sm font-medium text-stone-700 hover:text-stone-900">Insights</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200 text-left text-sm">
            <thead className="bg-stone-50 text-stone-600">
              <tr>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Updated</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {posts.map((post) => (
                <tr key={String(post._id)}>
                  <td className="px-6 py-4 font-medium text-stone-900">{post.title}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${post.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-stone-600">{new Date(post.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/posts/${String(post._id)}/edit`} className="text-stone-700 hover:text-stone-900">Edit</Link>
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
    </main>
  );
}

function StatCard({ label, value, href, highlight = false }: { label: string; value: string; href?: string; highlight?: boolean }) {
  const classes = highlight
    ? "rounded-2xl border border-amber-200 bg-amber-50 p-5"
    : "rounded-2xl border border-stone-200 bg-white p-5";

  const content = (
    <>
      <p className="text-sm text-stone-600">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-900">{value}</p>
    </>
  );

  if (href) {
    return <Link href={href} className={classes}>{content}</Link>;
  }

  return <div className={classes}>{content}</div>;
}
