import Link from "next/link";
import Image from "next/image";
import { TagPill } from "@/components/TagPill";
import { PublicPost } from "@/lib/serialize";

export function PostCard({ post }: { post: PublicPost }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md">
      {post.coverImageUrl ? (
        <div className="relative aspect-[16/9] overflow-hidden bg-stone-100">
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : null}

      <div className="space-y-4 p-6">
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Draft"}
          </p>
          <Link href={`/posts/${post.slug}`} className="block text-2xl font-semibold tracking-tight text-stone-900 hover:text-stone-600">
            {post.title}
          </Link>
        </div>

        <p className="text-base leading-7 text-stone-600">{post.excerpt || "Read the latest story."}</p>

        <Link href={`/posts/${post.slug}`} className="inline-flex font-medium text-stone-900 underline decoration-stone-400 underline-offset-4">
          Read story
        </Link>
      </div>
    </article>
  );
}
