import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { Comment } from "@/lib/models/Comment";
import { serializeComment } from "@/lib/serialize";
import { MarkdownView } from "@/components/MarkdownView";
import { TagPill } from "@/components/TagPill";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  await dbConnect();
  const post = await Post.findOne({ slug, status: "published" }).lean();
  if (!post) {
    return { title: "Revile | Story not found" };
  }

  return {
    title: `${String(post.title)} | Revile`,
    description: String(post.excerpt || "Read the latest from Revile."),
    openGraph: {
      title: String(post.title),
      description: String(post.excerpt || "Read the latest from Revile."),
      images: post.coverImageUrl ? [post.coverImageUrl] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: String(post.title),
      description: String(post.excerpt || "Read the latest from Revile."),
      images: post.coverImageUrl ? [post.coverImageUrl] : [],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  await dbConnect();
  const post = await Post.findOne({ slug, status: "published" }).lean();
  if (!post) {
    notFound();
  }

  const comments = await Comment.find({ postId: post._id, status: "approved" }).sort({ createdAt: -1 }).lean();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 border-b border-slate-200 pb-6">
        <Link href="/" className="logo text-xs font-bold uppercase tracking-[0.26em] text-blue-700 hover:text-blue-900">Revile</Link>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">{post.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Draft"}</span>
          <span>•</span>
          <span>{post.viewCount ?? 0} views</span>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">{post.tags?.map((tag: string) => <TagPill key={tag} tag={tag} />)}</div>
      </header>

      {post.coverImageUrl ? (
        <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100">
          <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 70vw" />
        </div>
      ) : null}

      <article className="mx-auto max-w-3xl">
        <MarkdownView content={post.body} />
      </article>

      <section className="mx-auto mt-14 max-w-3xl border-t border-slate-200 pt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Comments</h2>
        <p className="mt-2 text-sm text-slate-600">{comments.length} approved comments</p>

        <div className="mt-6 space-y-5">
          {comments.length ? comments.map((comment) => (
            <div key={String(comment._id)} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <strong className="font-medium text-slate-900">{comment.authorName}</strong>
                <time className="text-xs uppercase tracking-[0.12em] text-slate-500">{new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-slate-700">{serializeComment(comment as Parameters<typeof serializeComment>[0], false).body}</p>
            </div>
          )) : <p className="text-slate-600">No comments yet. Be the first to respond.</p>}
        </div>

        <form action={`/api/posts/${slug}/comments`} method="post" className="mt-10 space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <input type="hidden" name="redirectTo" value={`/posts/${slug}`} />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Name
              <input name="authorName" required className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-blue-500" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Email
              <input name="authorEmail" type="email" required className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-blue-500" />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            Comment
            <textarea name="body" required rows={6} className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-blue-500" />
          </label>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500">Comments are reviewed before appearing publicly.</p>
            <button type="submit" className="primary-button nav-cta rounded-lg px-4 py-2.5 text-sm font-semibold">Submit comment</button>
          </div>
        </form>
      </section>
    </main>
  );
}
