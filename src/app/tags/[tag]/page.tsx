import Link from "next/link";
import { dbConnect } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { PostCard } from "@/components/PostCard";
import { serializePost } from "@/lib/serialize";

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  await dbConnect();
  const posts = await Post.find({ status: "published", tags: tag }).sort({ publishedAt: -1, createdAt: -1 }).lean();
  const items = posts.map((post) => serializePost(post as Parameters<typeof serializePost>[0]));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 border-b border-stone-200 pb-6">
        <Link href="/" className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500 hover:text-stone-900">Revile Blog</Link>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">#{decodeURIComponent(tag)}</h1>
      </header>

      {items.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center text-stone-600">No stories match this tag yet.</div>
      )}
    </main>
  );
}
