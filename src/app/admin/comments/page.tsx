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
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-center justify-between border-b border-stone-200 pb-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Moderation</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-900">Comments</h1>
        </div>
        <Link href="/admin" className="text-sm font-medium text-stone-700 hover:text-stone-900">Back to dashboard</Link>
      </header>

      <div className="space-y-4">
        {comments.length ? comments.map((comment) => (
          <div key={String(comment._id)} className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-stone-900">{comment.authorName}</p>
                <p className="text-xs uppercase tracking-[0.12em] text-stone-500">{postMap.get(String(comment.postId)) ?? "Post"}</p>
              </div>
              <div className="flex items-center gap-2">
                <form action="/api/comments" method="post">
                  <input type="hidden" name="id" value={String(comment._id)} />
                  <input type="hidden" name="action" value="approve" />
                  <button type="submit" className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500">Approve</button>
                </form>
                <form action="/api/comments" method="post">
                  <input type="hidden" name="id" value={String(comment._id)} />
                  <input type="hidden" name="action" value="delete" />
                  <button type="submit" className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 hover:border-stone-400">Delete</button>
                </form>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-stone-700">{comment.body}</p>
            <div className="mt-3 text-xs uppercase tracking-[0.12em] text-stone-500">{comment.status}</div>
          </div>
        )) : <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center text-stone-600">No comments to moderate.</div>}
      </div>
    </main>
  );
}
