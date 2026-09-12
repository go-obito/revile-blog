import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

const bioHighlights = [
  "Narrative-driven reporting",
  "Data-informed analysis",
  "Clear, human-first storytelling",
];

export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_35%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] text-slate-900">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <header className="mb-8 flex items-center justify-between border-b border-slate-200/80 pb-6">
            <Link href="/" className="logo text-xs font-bold uppercase tracking-[0.28em] text-slate-900 hover:text-blue-700">
              Revile
            </Link>
            <Link href="/" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              Back to home
            </Link>
          </header>

          <section className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm">
            <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="p-6 sm:p-8 lg:p-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-blue-700">
                  About the editor
                </p>
                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-5xl lg:text-6xl">
                  Michael Mawuli
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                  Michael Mawuli is a writer, analyst, and observer of culture, technology, and the forces shaping everyday life.
                  He writes with a sharp eye for truth, context, and the stories behind the headlines — blending disciplined reporting
                  with a readable, human voice that makes complex issues feel immediate and clear.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {bioHighlights.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Focus</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">Global issues</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Style</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">Clear + bold</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Mission</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">Context over noise</p>
                  </div>
                </div>
              </div>

              <div className="relative border-t border-slate-200 bg-slate-100 p-4 sm:p-6 lg:border-l lg:border-t-0">
                <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"
                    alt="Portrait of Michael Mawuli"
                    className="h-[520px] w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 via-slate-900/25 to-transparent p-5 text-white">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-200">Writer</p>
                    <p className="mt-2 text-2xl font-semibold">Michael Mawuli</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.04)] sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">What Revile does</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
                Independent reporting for an era of overload.
              </h2>

              <div className="mt-6 space-y-5 text-base leading-8 text-slate-700">
                <p>
                  Revile is a modern editorial publication built to cut through the noise and return to thoughtful, trustworthy storytelling.
                  It covers the stories that matter — politics, technology, the world, culture, and the human realities behind every major shift.
                </p>
                <p>
                  The site exists to help readers understand what is happening, why it matters, and what it means in practical, human terms.
                  It blends journalism, analysis, and context so that each story feels informed, grounded, and worth reading.
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-900 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">Editorial promise</p>
              <ul className="mt-5 space-y-4">
                {[
                  "Clear, credible, and context-rich reporting",
                  "No hype without explanation",
                  "Stories that respect readers’ time",
                  "A voice grounded in curiosity and honesty",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-blue-400" />
                    <span className="text-base leading-7 text-slate-200">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
