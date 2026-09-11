import Image from "next/image";
import Link from "next/link";
import { dbConnect } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { serializePost } from "@/lib/serialize";

const NAV_ITEMS = [
  { label: "Latest", href: "/" },
  { label: "World", href: "/tags/world" },
  { label: "Tech", href: "/tags/tech" },
  { label: "Football", href: "/tags/football" },
];

export default async function HomePage() {
  await dbConnect();
  const posts = await Post.find({ status: "published" })
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(8)
    .lean();

  const items = posts.map((post) => serializePost(post as Parameters<typeof serializePost>[0]));
  const trending = items[0];
  const rest = items.slice(1);

  return (
    <main className="news-shell min-h-screen text-slate-900">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <header className="rounded-full border border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-between gap-4 md:justify-start">
              <Link href="/" className="logo text-2xl font-extrabold tracking-[0.18em] text-slate-900">REVILE</Link>
              <Link href="/about" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">About</Link>
            </div>

            <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600 md:gap-5">
              {NAV_ITEMS.map((item) => (
                <Link key={item.label} href={item.href} className="transition hover:text-slate-900">
                  {item.label}
                </Link>
              ))}
            </nav>

            <form className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 md:w-72">
              <span className="text-lg text-slate-400">⌕</span>
              <input
                type="search"
                aria-label="Search stories"
                placeholder="Search stories"
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </form>
          </div>
        </header>

        <section className="mt-8">
          {trending ? (
            <div className="story-card overflow-hidden rounded-[28px] bg-white p-4 sm:p-6">
              <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
                <div className="relative min-h-[260px] overflow-hidden rounded-[22px] bg-slate-100">
                  {trending.coverImageUrl ? (
                    <Image
                      src={trending.coverImageUrl}
                      alt={trending.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  ) : null}
                </div>

                <div className="flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2">
                    {trending.tags.slice(0, 3).map((tag) => (
                      <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-700">
                        {tag}
                      </Link>
                    ))}
                  </div>
                  <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
                    {trending.publishedAt ? new Date(trending.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Draft"}
                  </p>
                  <Link href={`/posts/${trending.slug}`} className="mt-3 block text-3xl font-bold leading-tight text-slate-900 hover:text-blue-700 sm:text-4xl">
                    {trending.title}
                  </Link>
                  <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">{trending.excerpt || "Read the latest story from Revile."}</p>
                  <Link href={`/posts/${trending.slug}`} className="primary-button nav-cta mt-6 inline-flex w-fit items-center rounded-full px-5 py-3 text-sm font-semibold shadow-sm transition">
                    Read story
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="story-card rounded-[28px] bg-white p-12 text-center text-slate-600">
              <h2 className="text-2xl font-bold text-slate-900">No published stories yet.</h2>
              <p className="mt-3 text-base text-slate-600">This page stays empty until the first post is published. Once it is live, the latest coverage will appear here automatically.</p>
            </div>
          )}
        </section>

        {rest.length > 0 ? (
          <section className="mt-10 grid gap-6 lg:grid-cols-2">
            {rest.map((post) => (
              <article key={post.id} className="story-card grid overflow-hidden rounded-[22px] bg-white md:grid-cols-[220px_1fr]">
                <div className="relative min-h-[200px] bg-slate-100">
                  {post.coverImageUrl ? (
                    <Image
                      src={post.coverImageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 220px"
                    />
                  ) : null}
                </div>

                <div className="flex flex-col justify-between p-5">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                          {tag}
                        </Link>
                      ))}
                    </div>
                    <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Draft"}
                    </p>
                    <Link href={`/posts/${post.slug}`} className="mt-2 block text-2xl font-bold leading-tight text-slate-900 hover:text-blue-700">
                      {post.title}
                    </Link>
                  </div>

                  <p className="mt-4 text-base leading-7 text-slate-600">{post.excerpt || "Read the latest story."}</p>
                </div>
              </article>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
}
