import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { Comment } from "@/lib/models/Comment";
import { serializeComment } from "@/lib/serialize";
import { MarkdownView } from "@/components/MarkdownView";
import { SiteFooter } from "@/components/SiteFooter";
import { TagPill } from "@/components/TagPill";

const NAV_ITEMS = [
  { label: "Latest", href: "/" },
  { label: "World", href: "/tags/world" },
  { label: "Tech", href: "/tags/tech" },
  { label: "Football", href: "/tags/football" },
];

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
  const publishedDate = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Draft";

  return (
    <>
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_35%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-5">
            <Link href="/" className="logo text-xl font-extrabold tracking-[0.2em] text-slate-900 hover:text-blue-700">REVILE</Link>
            <nav className="hidden items-center gap-5 md:flex">
              {NAV_ITEMS.map((item) => (
                <Link key={item.label} href={item.href} className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" aria-label="Search stories" className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-blue-200 hover:text-blue-700">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                <circle cx="11" cy="11" r="6" />
                <path d="M16 16L21 21" strokeLinecap="round" />
              </svg>
            </button>
            <Link href="/about" className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-900 sm:inline-flex">About</Link>
            <Link href="/admin/signup" className="primary-button nav-cta inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold shadow-sm shadow-blue-600/15 transition hover:-translate-y-0.5">
              Subscribe
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-[1100px] rounded-[32px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_25px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[980px]">
            <div className="flex flex-wrap gap-2">
              {post.tags?.map((tag: string) => (
                <TagPill key={tag} tag={tag} />
              ))}
            </div>

            <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-500">{publishedDate}</p>
            <h1 className="mt-4 max-w-[18ch] text-4xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-slate-200 py-4 text-sm text-slate-600">
              <span className="font-medium text-slate-900">Revile desk</span>
              <span>•</span>
              <span>{post.viewCount ?? 0} views</span>
              <span>•</span>
              <span>{comments.length} comments</span>
            </div>
          </div>

          {post.coverImageUrl ? (
            <div className="relative mx-auto mt-8 aspect-[16/9] w-full max-w-[980px] overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100">
              <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 980px" />
            </div>
          ) : null}

          <div className="mx-auto mt-10 max-w-[72ch]">
            <MarkdownView content={post.body} />
          </div>

          <div className="mx-auto mt-16 max-w-[72ch] rounded-[28px] border border-slate-200 bg-slate-50/80 p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Editor’s note</p>
            <p className="mt-3 text-lg leading-8 text-slate-700">{post.excerpt || "Independent reporting, clear context, and honest analysis—every day."}</p>
          </div>

          <section className="mx-auto mt-16 max-w-[72ch] border-t border-slate-200 pt-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Discussion</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Comments</h2>
              </div>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600">{comments.length} approved</span>
            </div>

            <div className="mt-6 space-y-5">
              {comments.length ? comments.map((comment) => (
                <div key={String(comment._id)} className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <strong className="font-medium text-slate-900">{comment.authorName}</strong>
                    <time className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-base leading-7 text-slate-700">{serializeComment(comment as Parameters<typeof serializeComment>[0], false).body}</p>
                </div>
              )) : <p className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">No comments yet. Be the first to respond.</p>}
            </div>

            <form action={`/api/posts/${slug}/comments`} method="post" className="mt-10 space-y-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <input type="hidden" name="redirectTo" value={`/posts/${slug}`} />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  Name
                  <input name="authorName" required className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white" />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Email
                  <input name="authorEmail" type="email" required className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white" />
                </label>
              </div>
              <label className="block text-sm font-medium text-slate-700">
                Comment
                <textarea name="body" required rows={6} className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white" />
              </label>
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <p className="text-sm text-slate-500">Comments are reviewed before appearing publicly.</p>
                <button type="submit" className="primary-button nav-cta rounded-full px-5 py-2.5 text-sm font-semibold">Submit comment</button>
              </div>
            </form>
          </section>
        </article>
      </div>
    </main>
    <SiteFooter />
    </>
  );
}
