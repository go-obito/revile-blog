import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { Comment } from "@/lib/models/Comment";
import { Post } from "@/lib/models/Post";
import { verifySessionToken } from "@/lib/auth";

export default async function CommentsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/admin/login");
  const session = await verifySessionToken(token);
  if (!session) redirect("/admin/login");

  await dbConnect();
  const comments = await Comment.find().sort({ createdAt: -1 }).lean();
  const posts = await Post.find({}, { _id: 1, title: 1 }).lean();
  const postMap = new Map(posts.map((post) => [String(post._id), post.title]));

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_35%),linear-gradient(180deg,#f8fbff_0%,#edf4ff_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between rounded-[28px] border border-blue-100 bg-white/90 px-5 py-5 shadow-[0_18px_40px_rgba(37,99,235,0.08)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">Moderation</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">Comments</h1>
          </div>
          <Link href="/admin" className="text-sm font-medium text-blue-700 hover:text-blue-900">Back to dashboard</Link>
        </header>

        <div className="space-y-4">
          {comments.length ? comments.map((comment) => (
            <div key={String(comment._id)} className="rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{comment.authorName}</p>
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{postMap.get(String(comment.postId)) ?? "Post"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <form action="/api/comments" method="post">
                    <input type="hidden" name="id" value={String(comment._id)} />
                    <input type="hidden" name="action" value="approve" />
                    <button type="submit" className="rounded-full bg-emerald-600 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-500">Approve</button>
                  </form>
                  <form action="/api/comments" method="post">
                    <input type="hidden" name="id" value={String(comment._id)} />
                    <input type="hidden" name="action" value="delete" />
                    <button type="submit" className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">Delete</button>
                  </form>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-slate-700">{comment.body}</p>
              <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{comment.status}</div>
            </div>
          )) : <div className="rounded-[24px] border border-dashed border-blue-200 bg-white/80 p-12 text-center text-slate-600">No comments to moderate.</div>}
        </div>
      </div>
    </main>
  );
}
