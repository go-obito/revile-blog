import Link from "next/link";
import Image from "next/image";
import { TagPill } from "@/components/TagPill";
import { PublicPost } from "@/lib/serialize";

export function PostCard({ post }: { post: PublicPost }) {
  return (
    <article className="story-card overflow-hidden rounded-lg flex flex-col h-full hover:shadow-lg transition-all duration-300">
      {/* Image Container */}
      {post.coverImageUrl && (
        <div className="relative aspect-video overflow-hidden bg-slate-100">
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Content Container */}
      <div className="flex flex-col justify-between flex-grow p-4 sm:p-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 2).map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="tag-pill text-xs"
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* Date */}
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Draft"}
        </p>

        {/* Title */}
        <Link
          href={`/posts/${post.slug}`}
          className="block text-lg sm:text-xl font-bold leading-tight text-slate-900 hover:text-blue-600 transition mb-3 line-clamp-2"
        >
          {post.title}
        </Link>

        {/* Excerpt */}
        <p className="text-sm leading-6 text-slate-600 line-clamp-2 mb-4 flex-grow">
          {post.excerpt || "Read the latest story."}
        </p>

        {/* Read More Link */}
        <Link
          href={`/posts/${post.slug}`}
          className="inline-flex font-medium text-blue-600 hover:text-blue-800 transition text-sm"
        >
          Read story →
        </Link>
      </div>
    </article>
  );
}
