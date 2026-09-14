import Image from "next/image";
import Link from "next/link";
import { dbConnect } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { serializePost } from "@/lib/serialize";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/site-header";

const NAV_ITEMS = [
  { label: "Latest", href: "/" },
  { label: "World", href: "/tags/world" },
  { label: "Tech", href: "/tags/tech" },
  { label: "Football", href: "/tags/football" },
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\\]\\]/g, "\\\\$&");
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }> | { q?: string };
}) {
  const { q } = (await searchParams) as { q?: string };
  const query = q?.trim() ?? "";
  let items: Awaited<ReturnType<typeof serializePost>>[] = [];
  let loadError = false;

  try {
    await dbConnect();
    const filter: Record<string, unknown> = { status: "published" };
    if (query) {
      const rx = new RegExp(escapeRegExp(query), "i");
      filter.$or = [{ title: rx }, { excerpt: rx }, { body: rx }, { tags: rx }];
    }
    const posts = await Post.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(8)
      .lean();

    items = posts.map((post) => serializePost(post as Parameters<typeof serializePost>[0]));
  } catch {
    loadError = true;
    items = [];
  }

  const trending = query ? undefined : items[0];
  const rest = query ? items : items.slice(1);

  return (
    <main className="news-shell min-h-screen text-slate-900">
      <SiteHeader />
      
      <div className="container-main pb-0 pt-4 sm:pt-6 lg:pt-8">
        {/* Search Section */}
        {!query && (
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <form action="/" method="get" className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 sm:py-4">
              <span className="text-lg text-slate-400 flex-shrink-0">🔍</span>
              <input
                type="search"
                name="q"
                defaultValue={query}
                aria-label="Search stories"
                placeholder="Search stories..."
                className="w-full bg-transparent text-sm sm:text-base text-slate-700 outline-none placeholder:text-slate-400"
              />
            </form>
          </div>
        )}

        {/* Search Results Header */}
        {query && (
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Results for "{query}"
            </h2>
            <Link
              href="/"
              className="secondary-button text-center sm:text-left"
            >
              Clear search
            </Link>
          </div>
        )}

        {/* Empty State */}
        {rest.length === 0 && !loadError && query && (
          <div className="story-card rounded-lg bg-slate-50 p-6 sm:p-8 text-center">
            <p className="text-slate-600 text-sm sm:text-base">No stories match your search.</p>
          </div>
        )}

        {/* Error State */}
        {loadError && (
          <div className="story-card rounded-lg bg-red-50 p-6 sm:p-8 text-center border border-red-200">
            <h2 className="text-xl sm:text-2xl font-bold text-red-900">Stories could not be loaded</h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-red-700">Please try again in a moment.</p>
          </div>
        )}

        {/* Trending Post - Featured */}
        {!query && trending && (
          <section className="mb-8 sm:mb-10 lg:mb-12">
            <div className="story-card overflow-hidden rounded-xl bg-white">
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.35fr_0.65fr] p-4 sm:p-6 lg:p-8">
                {/* Image */}
                <div className="relative min-h-[200px] sm:min-h-[300px] overflow-hidden rounded-lg bg-slate-100">
                  {trending.coverImageUrl ? (
                    <Image
                      src={trending.coverImageUrl}
                      alt={trending.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center gap-3 sm:gap-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {trending.tags.slice(0, 3).map((tag) => (
                      <Link
                        key={tag}
                        href={`/tags/${encodeURIComponent(tag)}`}
                        className="tag-pill"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>

                  {/* Date */}
                  <p className="text-xs sm:text-sm font-medium uppercase tracking-wide text-slate-500">
                    {trending.publishedAt
                      ? new Date(trending.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Draft"}
                  </p>

                  {/* Title */}
                  <Link
                    href={`/posts/${trending.slug}`}
                    className="block text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-slate-900 hover:text-blue-600 transition"
                  >
                    {trending.title}
                  </Link>

                  {/* Excerpt */}
                  <p className="text-sm sm:text-base leading-6 text-slate-600 line-clamp-3">
                    {trending.excerpt || "Read the latest story from Revile."}
                  </p>

                  {/* CTA Button */}
                  <Link
                    href={`/posts/${trending.slug}`}
                    className="primary-button w-fit mt-2 sm:mt-4"
                  >
                    Read story →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Posts Grid */}
        {rest.length > 0 && (
          <section className="mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">
              {query ? "More results" : "Latest stories"}
            </h2>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <article
                  key={post.id}
                  className="story-card overflow-hidden rounded-lg hover:shadow-lg transition-all flex flex-col"
                >
                  {/* Image */}
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

                  {/* Content */}
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

                    {/* Meta */}
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
                      className="block text-lg sm:text-xl font-bold leading-tight text-slate-900 hover:text-blue-600 transition mb-3"
                    >
                      {post.title}
                    </Link>

                    {/* Excerpt */}
                    <p className="text-sm leading-6 text-slate-600 line-clamp-2 mb-4">
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
              ))}
            </div>
          </section>
        )}

        {/* No Posts State */}
        {rest.length === 0 && !query && !loadError && (
          <div className="story-card rounded-lg bg-slate-50 p-8 sm:p-12 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">No published stories yet</h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-600">
              This page will display the latest stories once they are published.
            </p>
          </div>
        )}

        <SiteFooter />
      </div>
    </main>
  );
}
