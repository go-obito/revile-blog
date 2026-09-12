import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export default function AboutPage() {
  return (
    <>
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 border-b border-slate-200 pb-6">
          <Link href="/" className="logo text-xs font-bold uppercase tracking-[0.26em] text-blue-700 hover:text-blue-900">Revile</Link>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">About</h1>
        </header>

        <article className="story-card rounded-[24px] bg-white p-8 text-slate-700 shadow-sm">
          <p className="text-lg leading-8">
            Revile is a personal journal for sharp takes, big stories, and the things that deserve slower reading.
            It is written by a single author who reports with curiosity, covers the issues that matter, and leaves space
            for dissent, context, and honest perspective.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Focus</p>
              <p className="mt-3 text-base leading-7 text-slate-700">
                World reporting, technology, culture, and the stories behind the headlines.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Approach</p>
              <p className="mt-3 text-base leading-7 text-slate-700">
                Independent, plain-spoken analysis without noise, spin, or a rush to the obvious conclusion.
              </p>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
